/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package run;

import AtomParser.newParser;
import java.util.Scanner;

/**
 *
 * @author asmi598
 */
public class Main {
    
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        
        boolean stopRequested = false;
        while(!stopRequested)
        {
            if(scan.hasNextLine())
            {
                String line = scan.nextLine();
                String[] splt = line.split("\\s");
                
                //username
                final String user = splt[0];
                
                //build the message
                String messageBuilder = "";
                for(int l = 1; l< splt.length; l++)
                {
                    messageBuilder += splt[l] + " ";
                }
                messageBuilder = messageBuilder.trim();
              //if the message is a like/dislike ,change the message to uppercase
                if(messageBuilder.toLowerCase().contains("like") || messageBuilder.toLowerCase().contains("dislike"))
                        {
                            messageBuilder = messageBuilder.toUpperCase();
                        }
                else        //else change selected parts of the message to uppercase
                {
                    //free text is removed from the message
                    messageBuilder = messageBuilder.substring(messageBuilder.indexOf("#tui"));
                    String msgSplit[] = messageBuilder.split(" ");
                    messageBuilder = "";
                    for(int i = 0 ; i <3 ;i++)
                    {
                        msgSplit[i]= msgSplit[i].toUpperCase();
                    }
                    for(int i = 0 ; i <msgSplit.length ;i++)
                    {
                        messageBuilder = messageBuilder.concat(" "+msgSplit[i]);
                    }
                }
              
        
                final String message = messageBuilder;
               
                new Thread( new Runnable() {
                    @Override
                    public void run() {
                        newParser we = new newParser(user, message);
                    }
                }).start();
            }
        }
    }
    
}
