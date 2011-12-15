package WikiBot;

import AtomParser.AtomParser;
import AtomParser.User;
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
public class TestWikiBot {

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
    public TestWikiBot() {
        ap = new AtomParser("http://search.twitter.com/search.atom?q=%23tui%20%3AI%20%3Alike%20tairg%3AAT1G01040.1");
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

    private void addUsername() {

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
    
    /** gets the objectName,object_Id and predicate from the #tui message **/

    public boolean setSemanticSyntaxObjects(String message) {
        boolean validMessage = false;

        String[] messageElements = new String[4];
        if (message.contains("#tui")) {
            int i = 0;
            validMessage = true;
            Scanner scan = new Scanner(message).useDelimiter(":");
            while (scan.hasNext()) {
                messageElements[i] = scan.next();
                i++;
            }
            object_Id = messageElements[messageElements.length-1];
            ap.setObject(object_Id);
            Scanner scanner = new Scanner(messageElements[2]).useDelimiter(" ");
            messageType = scanner.next();
            object_name = scanner.next();
            System.out.println("OBJECT NAME : "+object_name);
            System.out.println("OBJECT ID : "+object_Id);
            System.out.println("MESSAGE TYPE : " + messageType);
        } else {
            return validMessage;
        }
        return validMessage;
    }
 
    // makes a page for all the users 

    public void setUserPage() {

        Iterator iterator = userList.iterator();
        while (iterator.hasNext()) {
            User user = (User) iterator.next();
            String title = user.getTitle();
            String pageName = user.getUserName();
            String content = null;
            if (setSemanticSyntaxObjects(title)) {
                for (int i = 0; i < username.length; i++) {
                    content = getPageContent(pageName);
                    Userpage userpage = new Userpage(pageName, object_Id, content, object_name);
                    if (content.length() < 2) {
                        userpage.createNewUserpage(messageType);

                    } else {
                        if (messageType.equalsIgnoreCase(DISLIKE)) {
                            userpage.createDislike(DISLIKE);
                        } else if (messageType.equalsIgnoreCase(LIKE)) {
                            userpage.createLike(LIKE);
                        }
                    }
                    content = userpage.getContent();
                    try {
                        wiki.edit(twiPage + pageName, content, "", false);
                    } catch (IOException ex) {
                        Logger.getLogger(TestWikiBot.class.getName()).log(Level.SEVERE, null, ex);
                    } catch (LoginException ex) {
                        Logger.getLogger(TestWikiBot.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }

            } else {
                //not a tui message
            }
        }
    }

    public void loginWiki() {
        try {
            wiki.login(BOT_USER, BOT_PASS);
        } catch (IOException ex) {
            Logger.getLogger(TestWikiBot.class.getName()).log(Level.SEVERE, null, ex);
        } catch (FailedLoginException ex) {
            Logger.getLogger(TestWikiBot.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private String getPageContent(String pageName) {
        String content = null;
        try {
            content = wiki.getPageText(twiPage + pageName) + "\n";

        } catch (IOException ex) {
            Logger.getLogger(TestWikiBot.class.getName()).log(Level.SEVERE, null, ex);
        }
        return content;
    }

    public static void main(String[] args) {

        TestWikiBot twb = new TestWikiBot();
    }
}
