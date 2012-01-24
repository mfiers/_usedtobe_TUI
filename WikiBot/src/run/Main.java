
package run;

import AtomParser.Parser;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * 
 */
public class Main {

    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        boolean stopRequested = false;
        while (!stopRequested) {
            if (scan.hasNextLine()) {
                try {
                    String line = scan.nextLine();
                    String[] splt = line.split("\\s");
                    //username
                    final String user = splt[0];
                    //build the message
                    String messageBuilder = "";
                    for (int l = 1; l < splt.length; l++) {
                        messageBuilder += splt[l] + " ";
                    }
                    messageBuilder = messageBuilder.trim();
                    //if the message is a like/dislike ,change the message to uppercase
                    if (messageBuilder.toLowerCase().contains("like") || messageBuilder.toLowerCase().contains("dislike")) {
                        messageBuilder = messageBuilder.toUpperCase();
                    } else //else change selected parts of the message to uppercase
                    {
                        //free text is removed from the message
                        messageBuilder = messageBuilder.substring(messageBuilder.indexOf("#tui"));
                        String msgSplit[] = messageBuilder.split(" ");
                        messageBuilder = "";
                        for (int i = 0; i < 3; i++) {
                            msgSplit[i] = msgSplit[i].toUpperCase();
                        }
                        for (int i = 0; i < msgSplit.length; i++) {
                            messageBuilder = messageBuilder.concat(" " + msgSplit[i]);
                        }
                    }
                    final String message = messageBuilder;
                    new Thread(new Runnable() {

                        @Override
                        public void run() {
                            Parser we = new Parser(user, message);
                        }
                    }).start();
                } catch (Exception ex) {
                    Logger.getLogger(Main.class.getName()).log(Level.SEVERE, "Exception happened in main");
                    Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
    }
}
