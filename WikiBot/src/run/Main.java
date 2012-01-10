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
                
                messageBuilder = messageBuilder.trim().toUpperCase().replace(" :", " TUI:");
                
                
                
                
                
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
