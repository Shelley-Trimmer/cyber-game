# ==================================
# CYBER RESCUE
# A Python Learning Game
# ==================================
 
score = 0
 
 
def add_score(points):
    global score
    score += points
    print("\nCORRECT! +" + str(points) + " points")
    print("Current Score:", score)
    print()
 
 
def game_over():
    print("\nGAME OVER!")
    print("Final Score:", score)
    input("\nPress Enter to exit...")
    quit()
 
 
def level1():
    print("\n======================")
    print("LEVEL 1 - LOGIN")
    print("======================")
 
    username = input("Enter your username: ")
 
    print("\nWelcome Agent", username)
 
    add_score(10)
 
 
def level2():
    print("\n======================")
    print("LEVEL 2 - VIRUS ALERT")
    print("======================")
 
    choice = input("A virus is detected. SCAN or IGNORE? ").lower()
 
    if choice == "scan":
        print("Correct! The virus has been isolated.")
        add_score(20)
    else:
        print("The virus spreads through the network!")
        game_over()
 
 
def level3():
    print("\n======================")
    print("LEVEL 3 - PASSWORD CRACK")
    print("======================")
 
    password = "python"
    attempts = 3
 
    while attempts > 0:
 
        guess = input("Guess the password: ").lower()
 
        if guess == password:
            print("Access Granted!")
            add_score(30)
            return
 
        attempts -= 1
        print("Wrong password.")
        print("Attempts remaining:", attempts)
 
    game_over()
 
 
def level4():
    print("\n======================")
    print("LEVEL 4 - FIND THE MALWARE")
    print("======================")
 
    malware = ["trojan", "worm", "spyware", "adware"]
 
    print("\nThreat List:")
 
    for threat in malware:
        print("-", threat)
 
    answer = input(
        "\nWhich threat is designed to spy on users? "
    ).lower()
 
    if answer == "spyware":
        print("Correct!")
        add_score(40)
    else:
        print("Incorrect answer.")
        game_over()
 
 
def level5():
    print("\n======================")
    print("LEVEL 5 - SECURITY QUIZ")
    print("======================")
 
    questions = {
        "What command displays text on the screen? ": "print",
        "What command collects user input? ": "input",
        "What keyword starts a decision statement? ": "if"
    }
 
    correct = 0
 
    for question, answer in questions.items():
 
        user_answer = input(question).lower()
 
        if user_answer == answer:
            print("Correct!")
            correct += 1
        else:
            print("Incorrect.")
 
    if correct >= 2:
        add_score(50)
    else:
        game_over()
 
 
def final_boss():
    print("\n======================")
    print("FINAL BOSS - AI VIRUS")
    print("======================")
 
    health = 3
 
    while health > 0:
 
        answer = input(
            "\nType PYTHON to attack the virus: "
        ).upper()
 
        if answer == "PYTHON":
            health -= 1
            print("DIRECT HIT!")
            print("Virus Health:", health)
        else:
            print("Attack failed!")
 
    add_score(100)
 
    print("\nNETWORK SAVED!")
    print("YOU ARE THE CYBER CHAMPION!")
    print("\nFinal Score:", score)
 
 
# ==========================
# GAME START
# ==========================
 
print("###################################")
print("#                                 #")
print("#       CYBER RESCUE GAME         #")
print("#                                 #")
print("###################################")
 
print("\nA dangerous AI virus has infected")
print("the college network.")
 
input("\nPress Enter to begin your mission...")
 
level1()
level2()
level3()
level4()
level5()
final_boss()
 
input("\nPress Enter to quit...")