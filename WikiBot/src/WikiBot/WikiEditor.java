package WikiBot;

import AtomParser.AtomParser;
import AtomParser.User;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.security.auth.login.FailedLoginException;
import javax.security.auth.login.LoginException;

/**
 *
 */
public class WikiEditor {

    private static String TEST_PAGE = "TAIR:AT1G01040.1";
    private static final String twiPage = "Twitter:";
    private static String BOT_USER = "TuiBot";
    private static char[] BOT_PASS = "u]767M4h657%2dj".toCharArray();
    private static final String GENE = "TAIRG";
    private static final String PROTEIN = "TAIRP";
    private AtomParser ap;
    private List<User> userList;
    String[] username;
    private Wiki wiki;
    private String object_name, object_Id;
    private static final String LIKE = "like";
    private static final String DISLIKE = "dislike";
    private String messageType;

    /**
     * @param args the command line arguments
     */
    public WikiEditor(AtomParser parser) {
        ap = parser;
        setUserList();
        username = new String[userList.size()];
        wiki = new Wiki("socgen.soer11.ceres.auckland.ac.nz/wiki/", "");
        addUsername();
        loadWiki();
    }

    private void loadWiki() {
        loginWiki();
        setUserPage();
       
    }

    private void setUserList() {
        userList = ap.getUserList();
    }
/** adds username **/

    public void addUsername() {
        int i = 0;
        Iterator iterator = userList.iterator();
        while (iterator.hasNext()) {
            User newUser = (User) iterator.next();
            setUsername(newUser.getUserName(), i);
            i++;
        }
    }
/** sets the name of all the users  **/
    private void setUsername(String name, int i) {
        username[i] = name;
    }

    public String[] getUsername() {
        return username;
    }
    
    /** sets the objectName,object_Id and predicate from the #tui message 
     returns false if the message is invalid**/

    public void setSemanticSyntaxObjects(String message) {
        String[] messageElements = new String[4];
        String[] msgObjects = new String[3];
        int i = 0;
        Scanner scan = new Scanner(message).useDelimiter(":");
        while (scan.hasNext()) {
            messageElements[i] = scan.next();
            i++;
        }
        object_Id = messageElements[messageElements.length - 1];
        ap.setObject(object_Id);
        Scanner scanner = new Scanner(messageElements[2]).useDelimiter(" ");
        messageType = scanner.next();
        object_name = scanner.next();
        setObjectPage(object_name.toUpperCase() + ":" + object_Id.toUpperCase());
        Logger.getLogger(WikiEditor.class.getName()).log(Level.INFO, "OBJECT NAME : ", object_name); //eg TAIRG
        Logger.getLogger(WikiEditor.class.getName()).log(Level.INFO, "OBJECT ID : ", object_Id);     //eg AT1G01040
        Logger.getLogger(WikiEditor.class.getName()).log(Level.INFO, "MESSAGE TYPE : ", messageType);   // eg LIKE
    }
 
    // makes a page for all the users in the userList

    public void setUserPage() {

        Iterator iterator = userList.iterator();
        while (iterator.hasNext()) {
            User user = (User) iterator.next();
            String title = user.getTitle();
            String pageName = user.getUserName();
            String content = null;
            setSemanticSyntaxObjects(title);    
          
            for (int i = 0; i < username.length; i++) {
                content = getPageContent(twiPage + pageName);
                Page userpage = new Page(pageName, object_Id, content, object_name);
                if (content.length() < 2) {             //if page does not exist,create a new userpage
                    userpage.createNewUserpage(messageType);
                }
                else {                                 //if the page already exists
                    if (messageType.equalsIgnoreCase(DISLIKE)) {
                        userpage.createDislike(DISLIKE);
                    } else if (messageType.equalsIgnoreCase(LIKE)) {
                        userpage.createLike(LIKE);
                    }
                }
                content = userpage.getContent();
                editWiki(twiPage + pageName, content, false);
            }
        }
    }
    public void editWiki(String pageName, String pageContent, boolean wikiB) {
        try {
            wiki.edit(pageName, pageContent, "", wikiB);
        } catch (IOException ex) {
            Logger.getLogger(WikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        } catch (LoginException ex) {
            Logger.getLogger(WikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        }
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
    public void loginWiki() {
        try {
            wiki.login(BOT_USER, BOT_PASS);
        } catch (IOException ex) {
            Logger.getLogger(WikiEditor.class.getName()).log(Level.SEVERE, null, ex);
        } catch (FailedLoginException ex) {
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
