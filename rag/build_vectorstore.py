"""
Build a FAISS vector store from ALL 5,936 German law Markdown files.

Pipeline:
1. LOAD: Read all law .md files
2. SPLIT: Chunk by paragraph (### heading = new chunk)
3. EMBED: OpenAI text-embedding-3-small (cheapest, fastest, good enough)
4. STORE: FAISS vector store (local, free, fast)

Cost: ~$0.50 for all 107K paragraphs (embedding is cheap)
Time: ~10-15 minutes
Result: A vector store that finds the most relevant paragraphs for ANY question
"""

import os
import json
import time
from pathlib import Path
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

LAWS_DIR = Path("laws")
OUTPUT_DIR = Path("rag/vectorstore")


def load_and_chunk_laws(laws_dir: Path) -> list[Document]:
    """Load all law markdown files and split into paragraph-level chunks."""
    docs = []
    files = sorted(laws_dir.glob("*.md"))
    print(f"Loading {len(files)} law files...")

    for md_file in files:
        content = md_file.read_text(encoding="utf-8")
        lines = content.split("\n")

        # Extract law metadata
        law_name = ""
        law_abbr = ""
        for line in lines:
            if line.startswith("# ") and not law_name:
                law_name = line[2:].strip()
            elif line.startswith("**Abkürzung:**"):
                law_abbr = line.replace("**Abkürzung:**", "").strip()

        # Split by ### headings (each paragraph = one chunk)
        current_section = ""
        current_text = []
        current_chapter = ""

        for line in lines:
            if line.startswith("## "):
                current_chapter = line[3:].strip()
            elif line.startswith("### "):
                # Save previous chunk
                if current_section and current_text:
                    text = "\n".join(current_text).strip()
                    if len(text) > 20:  # Skip tiny chunks
                        docs.append(Document(
                            page_content=f"{law_name}\n{current_section}\n\n{text}",
                            metadata={
                                "law": law_name,
                                "abbreviation": law_abbr,
                                "section": current_section,
                                "chapter": current_chapter,
                                "file": md_file.name,
                                "law_id": md_file.stem,
                            }
                        ))
                current_section = line[4:].strip()
                current_text = []
            elif current_section:
                current_text.append(line)

        # Don't forget the last chunk
        if current_section and current_text:
            text = "\n".join(current_text).strip()
            if len(text) > 20:
                docs.append(Document(
                    page_content=f"{law_name}\n{current_section}\n\n{text}",
                    metadata={
                        "law": law_name,
                        "abbreviation": law_abbr,
                        "section": current_section,
                        "chapter": current_chapter,
                        "file": md_file.name,
                        "law_id": md_file.stem,
                    }
                ))

    print(f"Created {len(docs)} chunks from {len(files)} files")
    return docs


def build_vectorstore(docs: list[Document], output_dir: Path):
    """Embed all chunks and save as FAISS index."""
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Embedding {len(docs)} chunks with OpenAI text-embedding-3-small...")
    print(f"Estimated cost: ~${len(docs) * 0.000005:.2f}")

    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small",
        # Uses OPENAI_API_KEY from environment
    )

    # Process in batches to show progress
    batch_size = 500
    vectorstore = None

    for i in range(0, len(docs), batch_size):
        batch = docs[i:i + batch_size]
        print(f"  Batch {i // batch_size + 1}/{(len(docs) + batch_size - 1) // batch_size} ({len(batch)} chunks)...")

        if vectorstore is None:
            vectorstore = FAISS.from_documents(batch, embeddings)
        else:
            batch_store = FAISS.from_documents(batch, embeddings)
            vectorstore.merge_from(batch_store)

        time.sleep(0.5)  # Rate limit safety

    # Save
    vectorstore.save_local(str(output_dir))
    print(f"Vector store saved to {output_dir}/")

    # Also save a metadata index
    meta = {
        "total_chunks": len(docs),
        "total_laws": len(set(d.metadata["law_id"] for d in docs)),
        "embedding_model": "text-embedding-3-small",
        "created": time.strftime("%Y-%m-%d %H:%M"),
    }
    with open(output_dir / "metadata.json", "w") as f:
        json.dump(meta, f, indent=2)
    print(f"Metadata: {json.dumps(meta, indent=2)}")


def test_search(output_dir: Path, query: str, k: int = 5):
    """Test search against the vector store."""
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectorstore = FAISS.load_local(str(output_dir), embeddings, allow_dangerous_deserialization=True)

    results = vectorstore.similarity_search(query, k=k)
    print(f"\nSearch: '{query}'")
    print(f"Top {k} results:")
    for i, doc in enumerate(results):
        print(f"\n  {i+1}. [{doc.metadata['abbreviation']}] {doc.metadata['section']}")
        print(f"     {doc.page_content[:150]}...")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "search":
        query = " ".join(sys.argv[2:]) or "Darf ich als Arbeitsloser dazuverdienen?"
        test_search(OUTPUT_DIR, query)
    else:
        docs = load_and_chunk_laws(LAWS_DIR)
        build_vectorstore(docs, OUTPUT_DIR)

        # Quick test
        test_search(OUTPUT_DIR, "Darf ich als Arbeitsloser dazuverdienen?")
        test_search(OUTPUT_DIR, "Kann mein Vermieter mich kündigen?")
        test_search(OUTPUT_DIR, "Wie viel Elterngeld bekomme ich?")
