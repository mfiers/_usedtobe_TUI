/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package AtomParser;

import WikiBot.newWikiEditor;

/**
 *
 * 
 */
public class newParser {
    
    private String username;
    private String message;
    private static final String REGEX_TUI = "^(.*)#TUI (TUI:.*)(TUI:.*)";
    private newWikiEditor editor;
    public newParser(String username,String message)
    {
        this.username = username;
        this.message = message;
        if(isValidTuiMessage())
        {
            editor = new newWikiEditor(username,message);
        }
    }
    
    public boolean isValidTuiMessage() {
        boolean isValid = false;
        String data = message.replace(" :", " TUI:");
        if (data.matches(REGEX_TUI)) {
            isValid = true;
        }
        return isValid;
    }
    
}
