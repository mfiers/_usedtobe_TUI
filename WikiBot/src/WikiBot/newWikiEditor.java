/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package WikiBot;

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

    private Wiki wiki;
    private static final String twiPage = "Twitter:";
    private static final String LIKE = "like";
    private static final String DISLIKE = "dislike";
    private static char[] BOT_PASS = "u]767M4h657%2dj".toCharArray();
    private String object_name, object_Id, messageType;
    private String username, message;
    private static String BOT_USER = "TuiBot";

    public newWikiEditor(String username, String message) {
        this.username = username;
        this.message = message;
        wiki = new Wiki("socgen.soer11.ceres.auckland.ac.nz/wiki/", "");
        loadWiki();
    }

    private void loadWiki() {
        loginWiki();
        setUserPage();

    }

    public void loginWiki() {
        try {
            try {
                wiki.login(BOT_USER, BOT_PASS);
            } catch (FailedLoginException ex) {
                Logger.getLogger(newWikiEditor.class.getName()).log(Level.SEVERE, null, ex);
            }
        } catch (IOException ex) {
            Logger.getLogger(WikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void setSemanticSyntaxObjects() {
        String[] messageElements = new String[4];
        String[] msgObjects = new String[3];
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
        setObjectPage(object_name.toUpperCase() + ":" + object_Id.toUpperCase());
        Logger.getLogger(WikiEditor.class.getName()).log(Level.INFO, "OBJECT NAME : ", object_name); //eg TAIRG
        Logger.getLogger(WikiEditor.class.getName()).log(Level.INFO, "OBJECT ID : ", object_Id);     //eg AT1G01040
        Logger.getLogger(WikiEditor.class.getName()).log(Level.INFO, "MESSAGE TYPE : ", messageType);   // eg LIKE
    }
     public void setObjectPage(String objectPagename) {
        String pageContent = getPageContent(objectPagename);
        Page objectPage = new Page(object_Id, object_name);
        if (pageContent.length() < 2) //object page does not exist
        {
            objectPage.createObjectPage();
            pageContent = objectPage.getContent();
            editWiki(objectPagename,pageContent,false);
        }

    }

    public void setUserPage() {


        setSemanticSyntaxObjects();
        String content = null;

        content = getPageContent(twiPage + username);
        Page userpage = new Page(username, object_Id, content, object_name);
        if (content.length() < 2) {             //if page does not exist,create a new userpage
            userpage.createNewUserpage(messageType);
        } else {                                 //if the page already exists
            if (messageType.equalsIgnoreCase(DISLIKE)) {
                userpage.createDislike(DISLIKE);
            } else if (messageType.equalsIgnoreCase(LIKE)) {
                userpage.createLike(LIKE);
            }
        }
        content = userpage.getContent();
        editWiki(twiPage + username, content, false);

    }
  public void editWiki(String username, String pageContent, boolean wikiB) {
        try {
            wiki.edit(username, pageContent, "", wikiB);
        } catch (IOException ex) {
            Logger.getLogger(WikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        } catch (LoginException ex) {
            Logger.getLogger(WikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
   private String getPageContent(String pageName) {
        String content = "";
        try 
        {
            content = wiki.getPageText(pageName) + "\n";

        } 
        catch (FileNotFoundException ex) {
            Logger.getLogger(WikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        }
        catch (IOException ex) {
            Logger.getLogger(WikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        }
        return content;
    }
}
