================================================================================
          PROJECT: EUPHORIA MANDALA — INTEGRATION & SETUP GUIDE
================================================================================
Version: 1.0 (High-Fidelity Engine)
Author: AI Build Assistant
Target Environment: Cursor / Vercel / React (Vite)
--------------------------------------------------------------------------------

1. THE BEGINNER'S GLOSSARY (READ THIS FIRST)
--------------------------------------------------------------------------------
If this is your first time using Cursor or a code editor, here are the basics:

• THE TERMINAL: This is a text-based window where you give your computer 
  direct instructions. 
  -> To open it in Cursor: Press `Cmd + J` (Mac) or `Ctrl + J` (Windows).
  -> It usually appears at the bottom of your screen.

• NPM INSTALL: This is a command you type into the terminal to download 
  "packages" (pre-written code tools) that the Mandala needs to work.

• COMPONENTS: These are the .tsx files. Think of them as "Lego bricks." 
  You build the brick in one file, and then you "place" it in your main app.

• REFS (useRef): In the Mandala code, you will see "useRef." This is a 
  special way of handling math that is too fast for standard React. 
  TELL CURSOR: "Do not change the useRef logic to useState."


2. STEP-BY-STEP INSTALLATION
--------------------------------------------------------------------------------

[STEP A: Install the "Tools"]
Open your Terminal in Cursor and paste the following line, then hit Enter:

npm install motion lucide-react clsx tailwind-merge

-> What this does: 
   - 'motion' handles the smooth cursor movement.
   - 'lucide-react' provides the Hand and Grab icons.
   - 'clsx/tailwind-merge' helps manage the styling.

[STEP B: Create the Files]
In the left-hand sidebar of Cursor, inside the 'src' folder, create a new 
folder called 'components'. Inside that folder, create two files:

1. Mandala.tsx       <- Paste the Mandala engine code here.
2. CustomCursor.tsx  <- Paste the Cursor interaction code here.


3. INTEGRATION (WIRING IT UP)
--------------------------------------------------------------------------------

[THE "HOME" ANCHOR]
The Mandala needs a "home base" to sit in when you aren't dragging it. 
In your main page (usually App.tsx or Hero.tsx), you must create an empty 
element with a specific ID. 

Example:
<div id="mandala-home" className="w-64 h-64 mx-auto" />

-> Why? The Mandala code looks for "mandala-home" to calculate where to 
   snap back to. If you don't add this, the Mandala might float off-screen.

[THE GLOBAL CSS]
Open your 'index.css' file. You MUST hide the default white mouse pointer 
so the custom one can show up. Add this to your body tag:

body {
  cursor: none; /* This hides the standard Windows/Mac arrow */
}

[PLACING THE COMPONENTS]
In your main 'App.tsx' file, import and place the components at the bottom 
of your main function:

import Mandala from './components/Mandala';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <main>
      <Header />
      <div id="mandala-home" /> {/* The Mandala's house */}
      
      {/* These sit on top of everything */}
      <Mandala />
      <CustomCursor />
    </main>
  );
}


4. PRO-TIPS FOR USING CURSOR AI
--------------------------------------------------------------------------------
Cursor is powerful because it "sees" your code. When you want to change the 
Mandala, use the "Chat" (Cmd+L) and use these prompts:

• TO CHANGE COLORS: 
  "Look at the strokeColor logic in Mandala.tsx. I want to change the 
  default color from dark gray to a soft neon green."

• TO CHANGE PHYSICS: 
  "In Mandala.tsx, make the Mandala feel 'heavier' by reducing the 
  lerpFactor and increasing the friction."

• TO FIX ERRORS: 
  If you see a red underline, highlight the code and press Cmd+K. 
  Type "Fix this" and Cursor will usually solve it instantly.


5. FINAL CHECKLIST
--------------------------------------------------------------------------------
[ ] Did I run 'npm install'?
[ ] Does my body CSS have 'cursor: none'?
[ ] Did I create a div with id="mandala-home"?
[ ] Are the files named exactly Mandala.tsx and CustomCursor.tsx?

If yes, your Euphoria Mandala should now be alive and interactive!
================================================================================
