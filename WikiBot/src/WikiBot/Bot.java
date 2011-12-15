
package WikiBot;

import AtomParser.AtomParser;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * Main bot that will run every minute to retrieve tweets from twitter
 */
public class Bot 
{
    
    /** What to send to twitter to search */
    private static final String SEARCH_QUERY = "#tui";
    
    /** Base URL to get twitter search (make sure to urlencode query to append*/
    private static final String BASE_URL = "http://search.twitter.com/search.atom?q=";
    
    /**
     * 
     * @param args null or zero length
     */
    public static void main(String[] args) 
    {
        //url to load
        String twitterSearch = BASE_URL;
        try 
        {
            //append 
            twitterSearch += URLEncoder.encode(SEARCH_QUERY, "UTF-8");
        } 
        catch (UnsupportedEncodingException ex) 
        {
            Logger.getLogger(Bot.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        Logger.getLogger(Bot.class.getName()).log(Level.INFO, "Search URL: {0}", twitterSearch);
        
        Bot b = new Bot(new AtomParser(twitterSearch));
        
    }
    
    /** Twitter feed to use */
    private AtomParser atomParser;
    
    
    /**
     * Creates a new bot with some search results from twitter
     * @param atomParser the search results from twitter
     */
    public Bot(AtomParser atomParser)
    {
        this.atomParser = atomParser;
    }
    
}
