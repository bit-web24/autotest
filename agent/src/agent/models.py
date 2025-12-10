from langchain_groq import ChatGroq
from langchain_openai import ChatOpenAI
from pydantic.types import SecretStr

from agent.settings import settings

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

# groq_llm = ChatOpenAI(
#     model="granite4:micro",
#     base_url="http://localhost:11434/v1",
#     temperature=0.1,
# )
