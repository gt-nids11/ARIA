from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import CharacterTextSplitter
from openai import OpenAI
from app.core.config import settings
import os

client = OpenAI(api_key=settings.OPENAI_API_KEY)
embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
persist_directory = "./chroma_db"

def get_vectorstore():
    # Attempt to load or create
    return Chroma(persist_directory=persist_directory, embedding_function=embeddings, collection_name="aria_docs")

def add_document_to_store(doc_id, text, metadata):
    try:
        text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = text_splitter.split_text(text)
        metadatas = [{"doc_id": doc_id, **metadata} for _ in chunks]
        
        vectorstore = get_vectorstore()
        vectorstore.add_texts(texts=chunks, metadatas=metadatas)
    except Exception as e:
        print(f"Error adding to index: {e}")

def query_documents(question: str, k=5) -> list:
    try:
        vectorstore = get_vectorstore()
        docs = vectorstore.similarity_search(question, k=k)
        return [{"content": doc.page_content, "metadata": doc.metadata} for doc in docs]
    except Exception as e:
        print(e)
        return []

def answer_question(question: str) -> str:
    try:
        chunks = query_documents(question)
        if not chunks:
            return "No relevant documents found to answer the question."
            
        context = "\n\n".join([f"Document {c['metadata'].get('doc_id', 'Unknown')}: {c['content']}" for c in chunks])
        
        prompt = f"Context:\n{context}\n\nQuestion: {question}"
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are ARIA, a government intelligence assistant. Using only the provided document context, answer the question accurately. If the answer is not in the context, say so clearly. Always cite which document you found the answer in."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error computing answer: {e}"
