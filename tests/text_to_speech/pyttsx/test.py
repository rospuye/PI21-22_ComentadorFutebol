# Python program to show
# how to convert text to speech
import pyttsx3

# Initialize the converter
converter = pyttsx3.init()

voices = converter.getProperty('voices')

def printVoices(converter):
    
    for voice in voices:
        # to get the info. about various voices in our PC 
        print("Voice:")
        print("ID: %s" %voice.id)
        print("Name: %s" %voice.name)
        print("Age: %s" %voice.age)
        print("Gender: %s" %voice.gender)
        print("Languages Known: %s" %voice.languages)

def testPitch(converter):

    text = "STOP POSTING ABOUT AMONG US! I'M TIRED OF SEEING IT! MY FRIENDS ON TIKTOK SEND ME MEMES, ON DISCORD IT'S FUCKING MEMES! I was in a server, right? and ALL OF THE CHANNELS were just among us stuff. I-I showed my champion underwear to my girlfriend and t-the logo I flipped it and I said 'hey babe, when the underwear is sus HAHA DING DING DING DING DING DING DING DI DI DING' I fucking looked at a trashcan and said 'THAT'S A BIT SUSSY' I looked at my penis I think of an astronauts helmet and I go 'PENIS? MORE LIKE PENSUS' AAAAAAAAAAAAAAHGESFG"

    rates = [300] # 64 foi o menor que foi

    for rate in rates:
        converter.setProperty("rate", rate)
        converter.say(text)



# # Set properties before adding
# # Things to say

# # Sets speed percent
# # Can be more than 100
# converter.setProperty('rate', 150)
# # Set volume 0-1
# converter.setProperty('volume', 0.7)

# # Queue the entered text
# # There will be a pause between
# # each one like a pause in
# # a sentence
# converter.say("This is bullshit")

# converter.setProperty('volume', 1)
# converter.setProperty('rate', 50)

# converter.say("B u l l shit")

# # Empties the say() queue
# # Program will not continue
# # until all speech is done talking

testPitch(converter)
converter.runAndWait()
