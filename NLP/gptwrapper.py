import os
import sys

query = sys.argv[1]
cmdline = "openai api completions.create -m ada:ft-personal-2022-10-27-13-43-18 --max-tokens 30 --temperature 0 --stop \"###\" -p $\'" + query + "\'"

os.system(cmdline)
