

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.security.auth.login.FailedLoginException;
import javax.security.auth.login.LoginException;

/**
 *
 */
public class TestWikiBot {

    
    private static String TEST_PAGE = "TAIR:AT1G01040.1";
    
    private static String BOT_USER = "TuiBot";
    private static char[] BOT_PASS = "u]767M4h657%2dj".toCharArray();
    
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        
        Wiki wiki = new Wiki("socgen.soer11.ceres.auckland.ac.nz/wiki/", "");
        try 
        {
            wiki.login(BOT_USER, BOT_PASS);
            
            
            String content = "";
            
            try
            {
                content = wiki.getPageText(TEST_PAGE) + "\n";
            }
            catch(FileNotFoundException ex)
            {
                //will come here when the page does not exist
            }
                        
            
            content += "Andrew likes this: " + System.currentTimeMillis();
            
            wiki.edit(TEST_PAGE, content, "", false);
            
            
            
            
            
        } 
        catch (IOException ex) 
        {
            Logger.getLogger(TestWikiBot.class.getName()).log(Level.SEVERE, null, ex);
        } 
        catch (FailedLoginException ex) 
        {
            Logger.getLogger(TestWikiBot.class.getName()).log(Level.SEVERE, null, ex);
        }
        catch (LoginException ex) 
        {
            Logger.getLogger(TestWikiBot.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
