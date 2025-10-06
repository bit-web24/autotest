from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from pydantic.types import SecretStr
from configs.settings import settings

local_llm = ChatOpenAI(
    model="qwen3:1.7b-q4_K_M",
    base_url="http://localhost:11434/v1",
    temperature=0.1,
)

groq_llm = ChatGroq(
    temperature=0.1,
    model=settings.MODEL,
    api_key=SecretStr(settings.GROQ_API_KEY),
)

instructor = ChatOpenAI(
    model="qwen3:4b-instruct",
    base_url="http://localhost:11434/v1",
    temperature=0.2,
)

coder_llm = ChatOpenAI(
    model="qwen2.5-coder:1.5b",
    base_url="http://localhost:11434/v1",
    temperature=0.2,
)

gemma3 = ChatOpenAI(
    model="gemma3:1b",
    base_url="http://localhost:11434/v1",
    temperature=0.2,
)
