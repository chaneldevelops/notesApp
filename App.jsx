import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"
//Allows to listen to changes in firestore database then make changes in local code
// For ex if I delete a note it will alert Snapshot and update the changes locally in the callback function
import { addDoc, onSnapshot, doc, deleteDoc } from "firebase/firestore" 
import { notesCollection, db } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0]?.id) || ""
    )
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    React.useEffect(() => {
        //Only want to setup when mounts
        //Going to store in a bariable to prevent memory link & give React the ability to unlink itself from the listener
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) { // This will give us the most updated notes from notesCollection
            //Sync up our local notes array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({ //For every document return an object that has all data from doc
                ...doc.data(),
                id: doc.id
            }))
           setNotes(notesArr)
        })
        return unsubscribe //React will call to clean up side effects
    }, [])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here"
        }
        const newNoteRef = await addDoc(notesCollection, newNote) //returns a promise so use await
        setCurrentNoteId(newNoteRef.id)
    }

    function updateNote(text) {
        setNotes(oldNotes => {
            const newArray = []
            for (let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if (oldNote.id === currentNoteId) {
                    // Put the most recently-modified note at the top
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }

    async function deleteNote(noteId) {
        //Reference to doc wanting to delete
        const docRef = doc(db, "notes", noteId) /*Database instance, name of collection to delete a doc from, 
        id of the doc trying to delete */
        //Added as a reference at top in firebase
        await deleteDoc(docRef) //because it returns a promise await is need & async function
        



        // This manually deleted notes
        // setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={currentNote}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
