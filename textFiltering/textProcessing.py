import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, AutoConfig, BitsAndBytesConfig

device = "cuda" # the device to load the model onto

# Tokenizer
model_name = 'mistralai/Mistral-7B-Instruct-v0.2'

model_config = AutoConfig.from_pretrained(model_name)

tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

# bitsandbytes parameters
use_4bit = True
bnb_4bit_compute_dtype = "float16"
bnb_4bit_quant_type = "nf4"
use_nested_quant = False

# set up quantization config
compute_dtype = getattr(torch, bnb_4bit_compute_dtype)

bnb_config = BitsAndBytesConfig(
    load_in_4bit=use_4bit,
    bnb_4bit_quant_type=bnb_4bit_quant_type,
    bnb_4bit_compute_dtype=compute_dtype,
    bnb_4bit_use_double_quant=use_nested_quant,
)

# Check GPU compatibility with bfloat16
if compute_dtype == torch.float16 and use_4bit:
    major, _ = torch.cuda.get_device_capability()
    if major >= 8:
        print("=" * 80)
        print("Your GPU supports bfloat16: accelerate training with bf16=True")
        print("=" * 80)

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=bnb_config,
)

inputs_not_chat = tokenizer.encode_plus("[INST] Tell me about solar panels? [/INST]", return_tensors="pt")['input_ids'].to(device)

generated_ids = model.generate(inputs_not_chat, 
                               max_new_tokens=1000, 
                               do_sample=True)
decoded = tokenizer.batch_decode(generated_ids)

print(decoded[0])
