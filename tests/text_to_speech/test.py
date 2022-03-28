# Import the required module for text
# to speech conversion
from tokenize import String
from gtts import gTTS

# This module is imported so that we can
# play the converted audio
import os

# The text that you want to convert to audio
filename = "important.mp3"

# Language in which you want to convert
language = 'en'

#
sentences = [("I'm talking at normal speed, you know?", False),
("I'm way slower than that guy before.", True)]

with open(filename, "wb") as fp:

    for text, speed in sentences:
        txt = gTTS(text=text, lang=language, slow=speed)
        txt.write_to_fp(fp)
    # Passing the text and language to the engine,
    # here we have marked slow=False. Which tells
    # the module that the converted audio should
    # have a high speed
    # myobj = gTTS(text=mytext, lang=language, slow=False)

    # myobj.write_to_fp(fp)

    # txt = gTTS(text=text2, lang="pt", slow=True)
    # txt.write_to_fp(fp)

    # Saving the converted audio in a mp3 file named
    # welcome
    # myobj.save(filename)

    # Playing the converted file

os.system(f"mplayer {filename}")
