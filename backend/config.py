# import os
# from dotenv import load_dotenv

# load_dotenv()

# config.py
import os
from dotenv import load_dotenv

load_dotenv()  # loads variables from .env


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
