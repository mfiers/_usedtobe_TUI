
package AtomParser;

import WikiBot.WikiEditor;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *Checks if the message is a valid TUI formatted message and 
 *Invokes newWikiEditor
 * 
 */
public class Parser {

    private String message;
    private static final String REGEX_TUI = "^(.*)#TUI (TUI:.*)(TUI:.*)";
    private static final String REGEX_TITLE_TUI = "^(.*)#TUI (.*:.*)(DC:TITLE)(.*)";
    private static final String REGEX_COMMENT_TUI = "^(.*)#TUI (.*:.*)(TUI:COMMENT)(.*)";
    private String messageType;

    public Parser(String username, String msg) {
        this.message = msg;
        messageType = "INVALID";
        
        Logger.getLogger(Parser.class.getName()).log(Level.INFO, "New #TUI message from {0}: {1}", new Object[]{username, msg});
        
        if (isValidTuiMessage()) {
            WikiEditor editor = new WikiEditor(username, this.message, messageType);
            Logger.getLogger(Parser.class.getName()).log(Level.INFO, " VALID TUI FORMATTED MESSAGE");
        } else {
            Logger.getLogger(Parser.class.getName()).log(Level.INFO, "NOT A VALID TUI FORMATTED MESSAGE");
        }
    }

    private boolean isValidTuiMessage() {
        boolean isValid = false;
        //need to put in "TUI:" in front of "I" and "Like"
        //message = message.replace(" :", " TUI:");
        String[] msgSplit = message.split("#TUI", 2); //limit two splits
        if (msgSplit.length > 1) {
            String tuiData = "#TUI " + msgSplit[1].trim();
            //need to check if the 5th index == "I"
            if (tuiData.charAt(5) == 'I') {
                tuiData = tuiData.replaceFirst("#TUI I", "#TUI TUI:I");
                //now replace either "like" or "dislike" with "tui:like/dislike".
                tuiData = tuiData.replaceFirst(" LIKE ", " TUI:LIKE ");
                tuiData = tuiData.replaceFirst(" DISLIKE ", " TUI:DISLIKE ");
                message = msgSplit[0] + tuiData;
                if (message.matches(REGEX_TUI)) {
                    isValid = true;
                }
                if (message.contains("LIKE")) {
                    messageType = "LIKE";
                } else {
                    if (message.contains("DISLIKE")) {
                        messageType = "DISLIKE";
                    }
                }
            } else {
                if (message.matches(REGEX_TITLE_TUI)) {
                    isValid = true;
                    messageType = "TITLE";
                }
                if (message.matches(REGEX_COMMENT_TUI)) {
                    isValid = true;
                    messageType = "COMMENT";
                }
            }
        }
        return isValid;
    }
}
