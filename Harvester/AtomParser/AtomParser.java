/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package AtomParser;

import java.io.IOException;
import java.util.ArrayList;
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
    private User user;
    public AtomParser()
    {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        queryList = new ArrayList<User>();
        try 
        {
            DocumentBuilder db = dbf.newDocumentBuilder();
           
            dom = db.parse("http://search.twitter.com/search.atom?q=%23tui%20%3Ai%20%3Alike");
            parseDocument();
            
        } catch (SAXException ex) {
            Logger.getLogger(AtomParser.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(AtomParser.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParserConfigurationException ex){
            Logger.getLogger(AtomParser.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    private void parseDocument()
    {
        
        //root element
        Element docEl = dom.getDocumentElement();
        NodeList nl = docEl.getElementsByTagName("entry");
        //get all the elements under entry
        if(nl!=null && nl.getLength()>0)
        {
            for(int i = 0; i <nl.getLength();i++)
            {
                Element el = (Element)nl.item(i);
                user = new User(i);
                user.setUser(el);
                queryList.add(user);
                System.out.println("User "+user.getUserIndex() + " Name: "+ user.getUserName() + " Title: " + user.getTitle() + " ImageURL : "+user.getImageUrl() + " published: "+ user.getPublished());
                
            }
        }
    }
    public static void main(String[] args)
    {
        AtomParser ap = new AtomParser();
        
    }
}
