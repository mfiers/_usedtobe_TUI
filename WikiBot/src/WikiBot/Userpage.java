/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package WikiBot;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * 
 */
public class Userpage {

    private String username;
    private static final String LIKE = "like";
    private static final String DISLIKE = "dislike";
    private String object_Id, content, object_name;
    private String type;

    public Userpage(String username, String object_Id, String content, String object_name) {
        this.content = content;
        this.object_name = object_name;

        this.username = username;
        this.object_Id = object_Id;
    }

    public void createNewUserpage(String type) {
        Logger.getLogger(Userpage.class.getName()).log(Level.INFO,"Creating new userpage");
        this.type = type;
        content = content.concat("[[Category:User]]\n");
        if (type.equalsIgnoreCase(LIKE)) {
            content = createLike(type);
        } else if (type.equalsIgnoreCase(DISLIKE)) {
            content = createDislike(type);
        }

    }

    public String createLike(String type) {
        this.type = type;
        if (!content.contains("<!-- LIKE_START_HERE-->")) {
            content = content.concat(getStartTag(LIKE, true));
            content = content.concat(semanticSyntax(type));
            content = content.concat(getStartTag(LIKE, false));

        } else {
            if (!content.contains(semanticSyntax(type))) {
                String splitContent, endContent;
                Logger.getLogger(Userpage.class.getName()).log(Level.INFO,"Appending Like syntax to the page");
                int index = content.indexOf("<!-- LIKE_START_HERE-->") + "<!-- LIKE_START_HERE-->".length();;
                splitContent = content.substring(0, index);
                endContent = content.substring(index, content.length());
                splitContent = splitContent.concat("\n" + semanticSyntax(type));
                splitContent = splitContent.concat(endContent);
                content = splitContent;
             } 
            else {
                return content;
            }
        }
        return content;
    }

    public String createDislike(String messageType) {
        this.type = messageType;
        if (!content.contains("<!-- DISLIKE_START_HERE-->")) {
            content = content.concat(getStartTag(DISLIKE, true));
            content = content.concat(semanticSyntax(messageType));
            content = content.concat(getStartTag(DISLIKE, false));

        } else {
            if (!content.contains(semanticSyntax(messageType))) {
                String splitContent, endContent;
                 Logger.getLogger(Userpage.class.getName()).log(Level.INFO,"Appending Dislike syntax to the page");
                int index = content.indexOf("<!-- DISLIKE_START_HERE-->") + "<!-- DISLIKE_START_HERE-->".length();;
                splitContent = content.substring(0, index);
                endContent = content.substring(index, content.length());
                splitContent = splitContent.concat("\n" + semanticSyntax(messageType));
                splitContent = splitContent.concat(endContent);
                content = splitContent;
            } else {
                return content;
            }
        }
        return content;
    }

    public String getContent() {
        return content;
    }

    //   eg for like     [[Like::TAIRG:AT1G01040.1]] ...genomeType-gene or protein(TAIRG)
    public String semanticSyntax(String messageType) {
        Logger.getLogger(Userpage.class.getName()).log(Level.INFO,"Creating semanticSyntax for the userpage");
        String semanticSyntax = "";
        String start = "[[";
        String col = ":";
        String end = "]]\n";
        semanticSyntax = semanticSyntax.concat(start + messageType + col + col + object_name + col + object_Id + end);
        return semanticSyntax;
        
    }

    public String getStartTag(String type, boolean begn) {
         Logger.getLogger(Userpage.class.getName()).log(Level.INFO,"Creating label");
        String data = "";
        String start;
        if (begn) {
            start = "START";
            data = "== List of " + type + " ==";
        } else {
            start = "END";
        }
        data = data.concat("\n" + "<!-- " + type.toUpperCase() + "_" + start + "_HERE-->\n");
        return data;
    }
}