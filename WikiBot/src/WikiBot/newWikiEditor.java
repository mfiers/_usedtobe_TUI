/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package WikiBot;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.security.auth.login.FailedLoginException;
import javax.security.auth.login.LoginException;

/**
 *
 * 
 */
public class newWikiEditor {

    static {
        try {
            //load the login details from file
            Scanner scan = new Scanner(new File("botpw.txt"));

            String line = null;
            while (scan.hasNextLine()) {
                line = scan.nextLine();
                //get the user login name
                if (line.startsWith("user")) {
                    BOT_USER = line.split("=", 2)[1];
                }
                //get the password
                if (line.startsWith("pass")) {
                    BOT_PASS = line.split("=", 2)[1].toCharArray();
                }
            }

        } catch (FileNotFoundException ex) {
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, "ERROR! botpw.txt file not found!");
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, null, ex);
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, "EXITING PROGRAM");
            System.exit(-1);

        }
    }
    private Wiki wiki;
    private static final String twiPage = "Twitter:";
    private static char[] BOT_PASS;
    private String object_name, object_Id, messageType, title;
    private String username, message;
    private static String BOT_USER;

    public enum validMessageType {

        LIKE, DISLIKE, TITLE, COMMENT
    };

    public newWikiEditor(String username, String message, String messageType) {
        this.username = username;
        this.message = message;
        this.messageType = messageType;
        title = "";
        wiki = new Wiki("socgen.soer11.ceres.auckland.ac.nz/wiki/", "");
        if (isValidMessageType(messageType)) {

            setSemanticSyntaxObjects(); // Extract information from the message
            loadWiki();
        } else {
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, "INVALID MESSAGE");
        }
    }

    private void loadWiki() {
        loginWiki();    // log onto wiki
        setObjectPage(object_name.toUpperCase() + ":" + object_Id.toUpperCase());   // check and set the object page
        setUserPage();      //check and set the userpage
    }

    public void loginWiki() {
        try {
            try {
                wiki.login(BOT_USER, BOT_PASS);
            } catch (FailedLoginException ex) {
                Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, null, ex);
            }
        } catch (IOException ex) {
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    /*
     *  Extracts objects from the message
     */

    private void getMessageObjects(String messageType) {
        if (messageType.equalsIgnoreCase(validMessageType.LIKE.toString()) || messageType.equalsIgnoreCase(validMessageType.DISLIKE.toString())) {
            String[] messageElements = new String[4];
            int i = 0;
            Scanner scan = new Scanner(message).useDelimiter(":");
            while (scan.hasNext()) {
                messageElements[i] = scan.next();
                i++;
            }
            object_Id = messageElements[messageElements.length - 1];

            Scanner scanner = new Scanner(messageElements[2]).useDelimiter(" ");
            messageType = scanner.next();
            object_name = scanner.next();

            Logger.getLogger(newWikiEditor.class.getName()).log(Level.INFO, "OBJECT NAME : ", object_name); //eg TAIRG
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.INFO, "OBJECT ID : ", object_Id);     //eg AT1G01040
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.INFO, "MESSAGE TYPE : ", messageType);   // eg LIKE
        }
        if (messageType.equalsIgnoreCase(validMessageType.TITLE.toString())) {
            String[] messageElements = new String[4];
            int i = 0;
            Scanner scan = new Scanner(message).useDelimiter(" ");
            while (scan.hasNext()) {
                if (i > 3) {
                    messageElements[messageElements.length - 1] = messageElements[messageElements.length - 1].concat(" " + scan.next());
                } else {
                    messageElements[i] = scan.next();
                }
                i++;
            }
            String split[] = messageElements[1].split(":");
            object_name = split[0];
            object_Id = split[1];
            title = messageElements[3];
        }
        /*
         * if (messageType.equalsIgnoreCase(validMessageType.COMMENT.toString()))
         * {
         *      split the message into object name,id and comment
         * }
         */
    }

    public void setSemanticSyntaxObjects() {
        switch (validMessageType.valueOf(messageType.toUpperCase())) {
            case LIKE:
                getMessageObjects(validMessageType.LIKE.toString());
                break;
            case DISLIKE:
                getMessageObjects(validMessageType.DISLIKE.toString());
                break;
            case TITLE:
                getMessageObjects(validMessageType.TITLE.toString());
                break;
            case COMMENT:
                getMessageObjects(validMessageType.COMMENT.toString());
                break;
            default:
                break;
        }

    }
    /*
     * Checks if the object page exists or not
     * Create a new object page if the page does not exist.
     */

    public void setObjectPage(String objectPagename) {
        String pageContent = getPageContent(objectPagename);
        Page objectPage = new Page(object_Id, object_name,messageType);

        if (pageContent.length() < 2) //object page does not exist
        {
            objectPage.createObjectPage();
            pageContent = objectPage.getContent();
            editWiki(objectPagename, pageContent, false);
        } else {
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.INFO, objectPagename, " : already exists");
        }
    }
    /*
     * Checks if the message is of a valid type
     * A message can only have Like,dislike,title,comment type
     */

    public boolean isValidMessageType(String messageType) {
        boolean isValid = false;
        switch (validMessageType.valueOf(messageType.toUpperCase())) {
            case LIKE:
            case DISLIKE:
            case TITLE:
            case COMMENT:
                isValid = true;
                break;
            default:
                isValid = false;
        }
        return isValid;
    }
    /*
     *     Checks if the page already exists or not
     *     appends the message to the page(using create() method)
     */

    public void setUserPage() {
        String content = null;
        content = getPageContent(twiPage + username);
        Page userpage = new Page(object_Id, content, object_name);
        switch (validMessageType.valueOf(messageType)) {
            case TITLE:
                userpage.setTitle(title);
                break;
            case COMMENT:
                /*
                 * set comment
                 */
                break;
            default:
                break;
        }
        if (content.length() < 2) {             //if page does not exist,create a new userpage
            userpage.createNewUserpage(messageType);
        } else {
            //if the page already exists,add the message to the page
            userpage.create(messageType);
        }
        content = userpage.getContent();
        editWiki(twiPage + username, content, false);
    }
    /*
     * append content to wiki
     */

    public void editWiki(String username, String pageContent, boolean wikiB) {
        try {
            wiki.edit(username, pageContent, "", wikiB);
        } catch (IOException ex) {
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        } catch (LoginException ex) {
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    /*
     * Gets page content from wiki
     */

    private String getPageContent(String pageName) {
        String content = "";
        try {
            content = wiki.getPageText(pageName) + "\n";

        } catch (FileNotFoundException ex) {
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        }
        return content;
    }
}
