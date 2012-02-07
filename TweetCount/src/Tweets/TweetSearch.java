/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package Tweets;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import java.util.logging.Level;
import java.util.logging.Logger;
import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.Tweet;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;

/**
 *
 * Searches twitter for #tui Like and Dislike messages sent each day
 * And keeps a count of the likes/dislikes 
 */
public class TweetSearch {

    private String startDate,endDate;
    private Twitter twitter;
    private List<String> likeList;      //list of tui like messages
    private List<String> dislikeList;   //list of tui dislike messages
    private static final String REGEX_LIKE = "^(.*)#TUI (I LIKE)(.*:.*)";   //tui like format
    private static final String REGEX_DISLIKE = "^(.*)#TUI (I DISLIKE)(.*:.*)"; //tui dislike format
    private HashMap<String, String> map;    //A map where key=messages and value = number of like/dislike

    public TweetSearch() {
        twitter = new TwitterFactory().getInstance();
        likeList = new ArrayList<String>();
        dislikeList = new ArrayList<String>();
        map = new HashMap();
        Calendar cal = setDate();   //gets the date to search for @tuiBot messages
        setLikeList();
        setDislikeList();
        Logger.getLogger(TweetSearch.class.getName()).log(Level.INFO, "Date: " + startDate);
        System.out.println("map: " + map.toString());
        TweetBot tweetBot = new TweetBot(map, cal);
    }
    /*
     * Sets the current date
     */

    public Calendar setDate() {
        Calendar cal = Calendar.getInstance();
        int day = cal.get(Calendar.DATE)-1;
        int endDay = cal.get(Calendar.DATE) ;
        int month = cal.get(Calendar.MONTH) + 1;
        int year = cal.get(Calendar.YEAR);
        startDate = ("" + year + "-" + month + "-" + day + "");
        endDate = ("" + year + "-" + month + "-" + endDay + "");
        
        System.out.println("StartDate: " + startDate);
         System.out.println("endDate: " + endDate);
        cal.set(year, month - 1, day - 1);   //sets date as the previous date
        return cal;
    }
    /*
     *  Sets the List of people with #tui like mesages
     */

    public void setLikeList() {
        try {
            Query likeQuery = new Query("#tui I like ");
            likeQuery.setSince(startDate);
            likeQuery.setUntil(endDate);
           
            QueryResult likeResult = twitter.search(likeQuery);
            List<Tweet> likeTweets = likeResult.getTweets();
            for (Tweet tweet : likeTweets) {
                System.out.println("@" + tweet.getFromUser() + " - " + tweet.getText() + " DATE: " + tweet.getCreatedAt());
                if (tweet.getText().toUpperCase().matches(REGEX_LIKE)) {
                    likeList.add(tweet.getText());
                }
            }
        } catch (TwitterException ex) {
            Logger.getLogger(TweetSearch.class.getName()).log(Level.SEVERE, null, ex);
        }
        getTuiObject("LIKE", likeList);
    }
    /*
     *  Sets the List of people with #tui dislike mesages
     */

    public void setDislikeList() {
        Query dislikeQuery = new Query("#tui I dislike ");
       dislikeQuery.setSince(startDate);
        dislikeQuery.setUntil(endDate);
           
                   
          try {

            QueryResult dislikeResult = twitter.search(dislikeQuery);
            List<Tweet> dislikeTweets = dislikeResult.getTweets();
            for (Tweet tweet : dislikeTweets) {
                System.out.println("@" + tweet.getFromUser() + " - " + tweet.getText() + " DATE: " + tweet.getCreatedAt());
                if (tweet.getText().toUpperCase().matches(REGEX_DISLIKE)) {
                    dislikeList.add(tweet.getText());
                }
            }
        } catch (TwitterException te) {
            te.printStackTrace();
            Logger.getLogger(TweetSearch.class.getName()).log(Level.INFO, "Failed to search tweets: ", te.getMessage());
        }
        getTuiObject("DISLIKE", dislikeList);
    }
    /*
     *  Splits the message
     */

    public void getTuiObject(String messageType, List<String> msgList) {
        for (String msg : msgList) {
            String[] tuiObject = msg.toUpperCase().split(messageType);

            if (messageType.equalsIgnoreCase("DISLIKE")) {
                addMap(false, tuiObject[1].trim());
            } else {
                addMap(true, tuiObject[1].trim());
            }
        }
    }
    /*
     *  Adds the object liked/disliked to a hashmap along with the count
     */

    public void addMap(boolean add, String tuiObject) {

        if (map.isEmpty()) {
            if (add) {
                map.put(tuiObject.trim(), "1|0");
            } else {
                map.put(tuiObject.trim(), "0|1");
            }

        } else {
            if (map.containsKey(tuiObject.trim())) //if the hashmap contains the key,then increment the count
            {
                String value = (String) map.get(tuiObject.trim());
                String[] valueSplit = value.split("|");
                int likeCount = Integer.parseInt(valueSplit[1]);
                int dislikeCount = Integer.parseInt(valueSplit[3]);
                if (add) {
                    likeCount = likeCount + 1;
                } else {
                    dislikeCount = dislikeCount + 1;
                }
                value = likeCount + "|" + dislikeCount;
                map.remove(tuiObject);
                map.put(tuiObject, value);
            } else {
                if (add) {
                    map.put(tuiObject, "1|0");
                } else {
                    map.put(tuiObject, "0|1");
                }
            }
        }
    }

    public static void main(String[] args) {
        TweetSearch ts = new TweetSearch();


    }
}
