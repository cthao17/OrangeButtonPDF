import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, AutoConfig, BitsAndBytesConfig, pipeline
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.llms import HuggingFacePipeline
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_core.runnables import RunnablePassthrough

import os

# device = "cuda" # the device to load the model onto

def setup():
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

    text_generation_pipeline = pipeline(
        model=model,
        tokenizer=tokenizer,
        task="text-generation",
        temperature=0.2,
        repetition_penalty=1.1,
        return_full_text=True,
        max_new_tokens=1000,
    )

    mistral_llm = HuggingFacePipeline(pipeline=text_generation_pipeline)

    # Load the json data from gemini output
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'pdfExtraction', 'sample', 'sampleGeminiOutput.txt'))
    loader = TextLoader(file_path)
    document = loader.load()

    # Chunk text
    text_splitter = CharacterTextSplitter(chunk_size=100, 
                                        chunk_overlap=0)
    chunked_documents = text_splitter.split_documents(document)

    # Load chunked document into FAISS index
    db = FAISS.from_documents(chunked_documents, 
                            HuggingFaceEmbeddings(model_name='sentence-transformers/all-mpnet-base-v2'))

    retriever = db.as_retriever()

    # Create promt template
    prompt_template = """
    ### [INST] Instruction: Answer the question based on your knowledge of the solar industry. Here is context to help:

    {context}

    ### QUESTION:
    {question} [/INST]
    """

    # Create prompt from prompt template 
    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template=prompt_template,
    )

    # Create llm chain 
    llm_chain = LLMChain(llm=mistral_llm, prompt=prompt)

    rag_chain = ( 
    {"context": retriever, "question": RunnablePassthrough()}
        | llm_chain
    )

    return rag_chain

if __name__ == '__main__':
    rag_chain = setup()

    output = rag_chain.invoke("At standard test conditions, give me the nominal power of fs-4112-3.")
    print(output['question'])
    print(output['text'])

    output = rag_chain.invoke("At standard test conditions, give me the voltage at P_max of fs-4112-3 as a key : value pair, then can you relabel voltage at P_max to V")
    print(output['question'])
    print(output['text'])

