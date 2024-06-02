import json
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.getenv("OPENAI_API_KEY"),
)


def get_completion_from_messages(system_message, user_message, model="gpt-4", temperature=0, max_tokens=500) -> str:

    messages = [
        {'role': 'system', 'content': system_message},
        {'role': 'user', 'content': f"{user_message}"}
    ]

    response = client.chat.completions.create(
        model=model,
        messages=messages,
    )

    chat_completion_message = response.choices[0].message

    return chat_completion_message.content


if __name__ == "__main__":
    system_message = "You are a helpful assistant"
    user_message = "Hello, how are you?"

    print(get_completion_from_messages(system_message, user_message))
