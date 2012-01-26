# #TUI - Semantic Microblogging in Community Genome Annotation
This project looks to embed semantic information in web pages and then allow users to tweet their views / suggestions of the page so that other people can see what they are talking about. The messages have semantic data encoded in them so that machines and programs can easily pick out the relevant information and do with it what they wish. We have defined a #TUI format so that anyone can come along and parse all the #TUI messages and have access to all the data.

The goal of TUI is to use existing cloud services to store all the data - rather than implement new public databases. Free microblogging services such as Twitter offer us ways to store this data and have it publicly available. 


## How it works
The user downloads the TUI Plugin for their favorite website(s) and installs it in their browser (for example the arabidopsis.org TUI plugin). When the user browses to this website the plugin scans the page to check if it is displaying a gene or protein (etc...). If so, then the plugin will inject new elements onto the page that the user can interact with. These include:

* Like/Dislike buttons - to like or dislike the current gene/protein/etc...
* Title change request - propose a new title for the gene/protein/etc...
* Comment - comment on the current gene/protein/etc...
* _More coming soon..._

When one of these options are chosen then the TUI plugin will create a semantic message (format similar to RDF) that can then be posted to twitter (or other microblogging service) to be stored. For example if the user likes the gene at this page: http://www.arabidopsis.org/servlets/TairObject?type=gene&name=AT1G01040.1
Then the semantic message would be this:  
__#tui I like tairg:AT1G01040.1__  

The #tui message would then be posted to the users twitter stream where it can then be publicly accessed and people could see that this user likes that gene.

## Domain Independent!
It doesn't have to be related to genomics - our examples implement this system on a range of different sites. Any website that has a generic page layout for articles, stories, blogs - this plugin can be easily and quickly implemented on the target site.

* Wikipedia
* Stuff.co.nz 
* NZHerald.co.nz


### Test URLs

http://www.arabidopsis.org/servlets/TairObject?type=gene&name=AT1G01040.1  
http://www.wormbase.org/db/gene/gene?name=WBGene00021408;class=Gene  


### Directory Descriptions:
__Plugin__: The base TUI plugincode  for browsers to inject TUI content and offer quick and easy #tui format messages to post to twitter and other microblogging services.  
__Sites__: A list of all the site-specific scripts for the TUI plugin.  
__WikiBot__: Polls twitter and identi.ca for #tui tweets and posts the data on Semantic Media Wiki.  
