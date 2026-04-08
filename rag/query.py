"""
Query the FAISS vector store with natural language questions.
Uses LangChain RAG chain: retrieve → augment → generate.

Can be used as:
1. CLI: python rag/query.py "Darf ich dazuverdienen?"
2. API server: python rag/query.py --serve (future)
3. Export: python rag/query.py --export (generate JSON for viewer)
"""

import os
import json
from pathlib import Path
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

VECTORSTORE_DIR = Path("rag/vectorstore")

# Persona descriptions for personalized answers
PERSONAS = {
    "student": "Student/in, jung, wenig Einkommen, WG, eventuell BAföG",
    "arbeitnehmer": "Angestellt, Vollzeit, sozialversicherungspflichtig",
    "selbststaendig": "Selbstständig/Freelancer, keine automatische Absicherung",
    "elternteil": "Verheiratet mit Kindern, Doppelverdiener oder Alleinverdiener",
    "alleinerziehend": "Alleinerziehend, ein Einkommen, Kind(er) im Haushalt",
    "rentner": "Im Ruhestand, 65+, lebt von Rente",
    "mieter": "Mieter/in einer Wohnung",
    "vermieter": "Vermieter/in, besitzt vermietete Immobilie(n)",
    "azubi": "In der Berufsausbildung, geringes Einkommen",
    "migrant": "Nicht-deutsche Staatsangehörigkeit, lebt in Deutschland",
    "schwanger": "Schwanger oder gerade Mutter geworden, im Arbeitsverhältnis",
    "arbeitslos": "Arbeitsuchend, bezieht Bürgergeld oder ALG I",
}


def get_chain(persona: str | None = None):
    """Build a LangChain RAG chain with the FAISS vector store."""
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectorstore = FAISS.load_local(str(VECTORSTORE_DIR), embeddings, allow_dangerous_deserialization=True)

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 6},
    )

    persona_text = ""
    if persona and persona in PERSONAS:
        persona_text = f"\n\nDie Person die fragt: {PERSONAS[persona]}. Beziehe dich konkret auf ihre Situation."

    template = """Du bist ein freundlicher Rechtsberater der Fragen zum deutschen Recht beantwortet.

REGELN:
- Antworte NUR basierend auf den bereitgestellten Gesetzestexten
- Wenn die Quellen die Frage nicht beantworten, sag ehrlich: "Dazu habe ich keine passenden Gesetzestexte."
- Nenne immer die relevanten Paragraphen (Gesetz + §)
- Erkläre einfach und verständlich (für einen 16-Jährigen)
- Gib ein konkretes Alltagsbeispiel
- Maximal 5-6 Sätze
- Dies ist KEINE Rechtsberatung{persona_text}

GESETZLICHE QUELLEN:
{context}

FRAGE: {question}

ANTWORT:"""

    prompt = PromptTemplate(template=template, input_variables=["context", "question"])

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2, max_tokens=400)

    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt},
    )

    return chain


def ask(question: str, persona: str | None = None) -> dict:
    """Ask a legal question and get a RAG-powered answer."""
    chain = get_chain(persona)
    result = chain.invoke({"query": question})

    sources = []
    for doc in result.get("source_documents", []):
        sources.append({
            "law": doc.metadata.get("law", ""),
            "abbreviation": doc.metadata.get("abbreviation", ""),
            "section": doc.metadata.get("section", ""),
            "law_id": doc.metadata.get("law_id", ""),
        })

    return {
        "answer": result["result"],
        "sources": sources,
    }


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python rag/query.py 'Deine Frage' [persona]")
        print("Personas:", ", ".join(PERSONAS.keys()))
        sys.exit(1)

    question = sys.argv[1]
    persona = sys.argv[2] if len(sys.argv) > 2 else None

    print(f"Frage: {question}")
    if persona:
        print(f"Persona: {persona} ({PERSONAS.get(persona, '?')})")
    print()

    result = ask(question, persona)
    print(f"Antwort:\n{result['answer']}")
    print(f"\nQuellen:")
    for s in result["sources"]:
        print(f"  [{s['abbreviation']}] {s['section']}")
