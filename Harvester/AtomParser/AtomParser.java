/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package AtomParser;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 *
 * @author mpra289
 */
public class AtomParser 
{
    private Document dom;
    private List<User> queryList;
    private String searchURL;
    private HashSet set;
    public AtomParser(String searchURL)
    {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        queryList = new ArrayList<User>();
        set = new HashSet();
        try 
        {
            DocumentBuilder db = dbf.newDocumentBuilder();
           
            dom = db.parse(searchURL);
            parseDocument();
            
        } catch (SAXException ex) {
            Logger.getLogger(AtomParser.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(AtomParser.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParserConfigurationException ex){
            Logger.getLogger(AtomParser.class.getName()).log(Level.SEVERE, null, ex);
        }
        viewUserData();
    }
    private void parseDocument()
    {
        
        //root element
        Element docEl = dom.getDocumentElement();
        NodeList nl = docEl.getElementsByTagName("entry");
        //get all the elements under entry(main tag)
        if(nl!=null && nl.getLength()>0)
        {
            for(int i = 0; i <nl.getLength();i++)
            {
                Element el = (Element)nl.item(i);
                User user = new User();
                user.setUser(el);
                if(!userFound(user.getUserName()))
                {
                    set.add(user.getUserName());    //add the username to the hashset
                    user.setUserIndex(set.size());  
                    queryList.add(user);    //add the user to the list
                }
                
            }
        }
    }
    private boolean userFound(String userName)
    {
        return set.contains(userName);
            
    }
    public void viewUserData()
    {
        Iterator iterator = queryList.iterator();
        while(iterator.hasNext())
        {
            User newUser = (User)iterator.next();
            
            System.out.println("User "+newUser.getUserIndex() + " Name: "+ newUser.getUserName() + " Title: " + newUser.getTitle() + " ImageURL : "+newUser.getImageUrl() + " published: "+ newUser.getPublished());
            
        }
    }
    public static void main(String[] args)
    {
        
        AtomParser ap = new AtomParser("http://search.twitter.com/search.atom?q=%23tui%20%3Ai%20%3Alike");
        
    }
}
