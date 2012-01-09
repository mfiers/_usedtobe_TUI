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
                String user = splt[0];
                
                //build the message
                String message = "";
                for(int l = 1; l< splt.length; l++)
                {
                    message += splt[l] + " ";
                }
                
                message = message.trim().toUpperCase().replace(" :", " TUI:");
                
                
                newParser we = new newParser(user, message);
            }
        }
    }
    
}
