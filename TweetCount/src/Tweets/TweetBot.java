/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package Tweets;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import twitter4j.ResponseList;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.conf.ConfigurationBuilder;
import twitter4j.examples.tweets.UpdateStatus;

/**
 *
 * @author mpra289
 */
public class TweetBot {

    private static final String CONSUMERKEY = "aWViyageGgCSo8OprgoEdg";
    private static final String CONSUMERSECRET = "5Dd85xQbQPzc4ygBwOipXaq5y14i9kG3gk97VUnNAg";
    private static final String ACCESSTOKEN = "480742204-vfL2KPp6dFHnWU9uNhiS70w4e7FeVX1CxoXaUnds";
    private static final String TOKENSECRET = "gJvEerMcLhgpJ4QicAdxQJzrv1iiGLzEN0FFLX9irSs";
    private ConfigurationBuilder cb;
    private Twitter twitter;
    private HashMap<String, String> tweetMap;
    private Calendar todayDate;
    private static final String REGEX = "^(.*)#tui (.*:.*)(like:.*)(dislike:.*)";

    public TweetBot(HashMap<String, String> tweetMap, Calendar todayDate) {
        this.tweetMap = tweetMap;
        setConfig();
        this.todayDate = todayDate;
        getTuiBotTimeline();
        mapIterator();
    }

    private void mapIterator() {
        Set s = tweetMap.entrySet();
        Iterator i = s.iterator();
        while (i.hasNext()) {
            generateTweet(i.next().toString());
        }
    }

    private void setConfig() {
        cb = new ConfigurationBuilder();
        cb.setOAuthConsumerKey(CONSUMERKEY);
        cb.setOAuthConsumerSecret(CONSUMERSECRET);
        cb.setOAuthAccessToken(ACCESSTOKEN);
        cb.setOAuthAccessTokenSecret(TOKENSECRET);
        TwitterFactory tf = new TwitterFactory(cb.build());
        twitter = tf.getInstance();
    }
    /*
     * Generate tweet to be sent to @tuibot
     */

    public void generateTweet(String mapContent) {
        String tweetMessage = "#tui";
        String[] mapSplit = mapContent.split("=");
        tweetMessage = tweetMessage.concat(" " + mapSplit[0].trim());
        tweetMessage = tweetMessage.concat(" like:" + mapSplit[1].split("|")[1].trim() + " dislike:" + mapSplit[1].split("|")[3].trim());
        System.out.println("Generated Message: " + tweetMessage);
        sendTweet(tweetMessage);
    }
    /*
     *  Post tweet to @tuibot
     */

    public void sendTweet(String message) {
        try {
            Status status = twitter.updateStatus(message);
            System.out.println("Updated Status");
            if (status.getId() == 0) {
                System.out.println("Error occured while posting tweets to twitter");
            }
        } catch (TwitterException ex) {
            Logger.getLogger(UpdateStatus.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    /*
     *  Gets the Timeline of @tuibot
     *  Uses only the tweets made the previous day.
     */

    private void getTuiBotTimeline() {
        try {
            ResponseList<Status> timelineList = twitter.getUserTimeline();
            Iterator iterator = timelineList.iterator();
            while (iterator.hasNext())
            {
                Status element = (Status) iterator.next();
                Calendar statusDate = Calendar.getInstance();
                statusDate.setTime(element.getCreatedAt());
                int compare = statusDate.compareTo(todayDate);
                System.out.println("element: " + element.getText() + " compare: " + compare);
                if (compare > 0) 
                {
                    String statusText = element.getText();
                    checkMap(statusText);
                } 
                else 
                {
                    Logger.getLogger(UpdateStatus.class.getName()).log(Level.INFO, "Status ID is less that the lastUpdate");
                }
            }
        } 
        catch (TwitterException ex) 
        {
            Logger.getLogger(TweetBot.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    /*
     *  Updates the hashmap
     */

    public void checkMap(String status) {
        if (status.matches(REGEX)) //checks if the tuiBot status is of valid format
        {
            String[] splitStatus = status.split(" ");
            String key = splitStatus[1].trim();
            int likeCount = Integer.parseInt(splitStatus[2].split(":")[1]);
            int dislikeCount = Integer.parseInt(splitStatus[3].split(":")[1]);
            if (tweetMap.containsKey(key))
            {
                String value = (String) tweetMap.get(key);
                int likeValue = Integer.parseInt(value.trim().split("|")[1]);
                int dislikeValue = Integer.parseInt(value.trim().split("|")[3]);
                likeValue = likeValue + likeCount;
                dislikeValue = dislikeValue + dislikeCount;
                value = likeValue + "|" + dislikeValue;
                tweetMap.remove(key);
                tweetMap.put(key, value);
            } 
            else 
            {
                String value = "" + likeCount + "|" + dislikeCount;
                tweetMap.put(key, value);
            }
        } 
        else 
        {
            Logger.getLogger(TweetBot.class.getName()).log(Level.INFO, "Not a valid formatted status");
        }
    }
}
