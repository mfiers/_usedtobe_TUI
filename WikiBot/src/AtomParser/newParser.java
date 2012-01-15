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
    public newParser(String username,String msg)
    {
        this.username = username;
        this.message = msg;
        if(isValidTuiMessage())
        {
            editor = new newWikiEditor(username,this.message);
        }
    }
    
    public boolean isValidTuiMessage() {
        boolean isValid = false;
        
        //need to put in "TUI:" in front of "I" and "Like"
        
        //message = message.replace(" :", " TUI:");
        
        String[] msgSplit = message.toUpperCase().split("#TUI", 2); //limit two splits
        if(msgSplit.length > 1)
        {
            String tuiData = "#TUI " + msgSplit[1].trim();
            
            //need to check if the 5th index == "I"
            if(tuiData.charAt(5) == 'I')
            {
                tuiData = tuiData.replaceFirst("#TUI I", "#TUI TUI:I");
            }
            
            //now replace either "like" or "dislike" with "tui:like/dislike".
            tuiData = tuiData.replaceFirst(" LIKE ", " TUI:LIKE ");
            tuiData = tuiData.replaceFirst(" DISLIKE ", " TUI:DISLIKE ");
            
            message = msgSplit[0] + tuiData;
            
            if (message.matches(REGEX_TUI)) {
                isValid = true;
            }
        }
        
        
        
        return isValid;
    }
    
}