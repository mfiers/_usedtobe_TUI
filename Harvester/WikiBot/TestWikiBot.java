package WikiBot;

import AtomParser.AtomParser;
import AtomParser.User;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.security.auth.login.FailedLoginException;
import javax.security.auth.login.LoginException;

/**
 * Andrew and Mukti
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
    private static final int LIKE = 0;
    private static final int DISLIKE = 1;
    private int type;

    /**
     * @param args the command line arguments
     */
    public TestWikiBot() {
        ap = new AtomParser("http://search.twitter.com/search.atom?q=%23tui%20%3AI%20%3Alike%20tairg%3AAT1G01040.1");

        ap.setObject("AT1G01040.1");
        type = LIKE;
        setUserList();
        username = new String[userList.size()];

        wiki = new Wiki("socgen.soer11.ceres.auckland.ac.nz/wiki/", "");
        String testing = "";
        String test = appendContent(testing);
        loadWiki();
    }

    public void loadWiki() {
        loginWiki();
        setUserPage();

    }

    public void setUserList() {
        userList = ap.getUserList();

    }

    public String appendContent(String content) {
//        setUserLikeList();
//        content = "";
        int i = 0;
        Iterator iterator = userList.iterator();
        while (iterator.hasNext()) {

            User newUser = (User) iterator.next();
            setUsername(newUser.getUserName(), i);
            i++;
        }
        // content = content.concat("\n"+"This gene has "+ ap.getNumberOfUsers()+ " likes.");
        return content;
    }

    private void setUsername(String name, int i) {

        username[i] = name;

    }

    public String[] getUsername() {

        return username;
    }

    // makes a page for all the users 
    public void setUserPage() {

        for (int i = 0; i < username.length; i++) {
            String pageName = username[i];
            String likeObject = ap.getObject();
            String content = null;
            content = getPageContent(pageName);
            System.out.println("content: " + content.length());
            Userpage userpage = new Userpage(pageName, likeObject, content, GENE);
            if (content.length() < 2) {
                userpage.createNewUserpage(type);

            } else {
                if (type == DISLIKE) {
                    userpage.createDislike(DISLIKE);
                } else if (type == LIKE) {
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
