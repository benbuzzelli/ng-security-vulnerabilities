# Echo server program
# The code receives a message sent from client, then
# sends the message unchanged back to client

# all of this needs to connect to the webapp html client on the submission page.
import socket
HOST = '' # Symbolic name meaning the local host
PORT = 51008 # Arbitrary non-privileged port
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((HOST, PORT))
s.listen(1)
conn, addr = s.accept()
print 'Connected by', addr

def generateListOfFilePaths(gitRepo):
    # some code to iterate through a repo and pull all the files into a list of
    # strings
    return
def openML(fileName):
    #opens an ml and returns a pointer to it or something
    return
def runML(commitMessage, mlFilePath):
    ml = openML(mlFilePath)
    result =  something # some code to run the commitMessage through the opened ml
    return result

def storeUserCommit(commitMessage):# i don't think we can store the ml result
    #some python code to store a commit message on our firebase server
    #IF AND ONLY IF it doesn't already exist there. String compare.
    return

def calcVulnPercent(gitFilePath, ml):
    vulnCount = 0
    nonVulnCount = 0
    vulnLikelyHood = 0
    someArbitraryNumberOfCommits = 100
    for x in range(someArbitraryNumberOfCommits):
        #individualCommit = run ben's script on git file path
        #mlResult = runML(individualCommit,ml)
        if mlResult:
            vulnCount = vulnCount + 1
        else:
            nonVulnCount = nonVulnCount + 1
    vulnLikelyHood = vulnCount/(vulnCount+nonVulnCount)
    return vulnLikelyHood



def mlSelection(data):
    switcher = {
        1:"ML 1 file path",
        2:"ML 2 file path",
        3:"ML 3 file path",
        4:"ML 4 file path",
        5:"ML 5 file path",
        6:"ML 6 file path",
        7:"ML 7 file path",
        8:"ML 8 file path",
        9:"ML 9 file path",
        10:"ML 10 file path",
        11:"ML 11 file path",
        }
    return switcher.get(data, "Invalid Selection\n")

while 1:
    # data will either be a structure with a string and an int or
    # we will recieve the string and then the integer separately. Whatever is
    # is better with HTML client.
    data = conn.recv(1024)

    mlFilePath = mlSelection(data.mlSelection)
    gitRepo = data.repoLink
    listOfFiles = generateListOfFilePaths(gitRepo)
    for x in listOfFiles:
        vulnLikelyHood = calcVulnPercent(x, mlSelection(mlFilePath))
    if not data: break
    conn.send(mlSelection(vulnLikelyHood);
conn.close()
