# AERO8 MVP demo

This is a Ukrainian language, responsive promotional frontend for a fuel station network. Its main actions are finding a station and joining the loyalty program. All prices, station locations, services, offers, and profile information are local mock data; no ERP, payment, or account service is connected.

The landing page uses a dark, editorial visual direction with an amber accent. It leads from a clear hero call to action to current demo prices, a station finder with search and filters, a fill up calculator, and a loyalty invitation. The station finder pairs a stylized local map with accessible cards and a selected station detail. The loyalty dialog offers an immediate demo account and stores only a local session flag.

Key checks: a production build, station filtering and calculator tests, and a local HTTP smoke request. At narrow widths, all actions remain usable without horizontal scrolling. The supplied Google Maps link is offered as a separate route to the owner's location; its address cannot be verified from this environment.
