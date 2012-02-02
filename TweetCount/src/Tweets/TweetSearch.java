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
 * @author mpra289
 */
public class TweetSearch {
    private String date;
    private Twitter twitter;
    private List<String> likeList;      //list of tui like messages
    private List<String> dislikeList;   //list of tui dislike messages
    private static final String REGEX_LIKE = "^(.*)#TUI (I LIKE)(.*:.*)";   //tui like format
    private static final String REGEX_DISLIKE = "^(.*)#TUI (I DISLIKE)(.*:.*)"; //tui dislike format
    private HashMap map;    //A map where key=messages and value = number of like/dislike

    public TweetSearch() {
        twitter = new TwitterFactory().getInstance();
        likeList = new ArrayList<String>();
        dislikeList = new ArrayList<String>();
        map = new HashMap();
        setDate();
        setLikeList();
        setDislikeList();
        System.out.println("map: " + map.toString());

    }
    /*
     * Sets the current date
     */

    public void setDate() {
        Calendar cal = Calendar.getInstance();
        int day = cal.get(Calendar.DATE);
        int month = cal.get(Calendar.MONTH)+1;
        int year = cal.get(Calendar.YEAR);
         date = ("" + year + "-" + month + "-" + day + "");

    }
/*
     *  Sets the List of people with #tui like mesages
     */
    public void setLikeList() {
        try {
            Query likeQuery = new Query("#tui I like ");
            likeQuery.setSince(date);
            QueryResult likeResult = twitter.search(new Query("#tui I like "));
            List<Tweet> likeTweets = likeResult.getTweets();
            for (Tweet tweet : likeTweets) {
                System.out.println("@" + tweet.getFromUser() + " - " + tweet.getText());
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
        dislikeQuery.setSince(date);
        try {
            QueryResult dislikeResult = twitter.search(dislikeQuery);
            List<Tweet> dislikeTweets = dislikeResult.getTweets();
            for (Tweet tweet : dislikeTweets) {
                System.out.println("@" + tweet.getFromUser() + " - " + tweet.getText());
                if (tweet.getText().toUpperCase().matches(REGEX_DISLIKE)) {
                    dislikeList.add(tweet.getText());
                }
            }
        } catch (TwitterException te) {
            te.printStackTrace();
            System.out.println("Failed to search tweets: " + te.getMessage());
        }
        getTuiObject("DISLIKE", dislikeList);
    }

    public void getTuiObject(String messageType, List<String> msgList) {
        for (String msg : msgList) {
            String tuiObject = msg.split(messageType)[0];
            if (messageType.equalsIgnoreCase("DISLIKE")) {
                addMap(false, tuiObject);
            } else {
                addMap(true, tuiObject);
            }
        }
    }
/*
     *  Adds the count to the key
     */
    public void addMap(boolean add, String tuiObject) {

        if (map.isEmpty()) {
            map.put(tuiObject, new Integer(1));
        } else {
            if (map.containsKey(tuiObject)) {
                int value = (Integer) map.get(tuiObject);
                value = value + 1;
                map.remove(tuiObject);
                map.put(tuiObject, value);
            } else {
                map.put(tuiObject, new Integer(1));
            }
        }
    }

    public static void main(String[] args) {
        TweetSearch ts = new TweetSearch();


    }
}
