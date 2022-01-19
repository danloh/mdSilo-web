
# mdSilo

A mind silo for storing ideas, thought, knowledge with a powerful writing tool,
which runs entirely in the browser and has Local File System Access ability. 
No installation is required, No registering is required.
The data is stored on your computer or in your browser and can be exported as a single json file.

[Demo](https://mdsilo.com/app)  
[Gitter](https://gitter.im/mdSilo)  
[Discord](https://discord.gg/EXYSEHRTFt)

## Features

- WYSIWYG Editor, Real time preview, Markdown support  
- Slash command, hotkeys and more toolkits...   
- Graph view 
- Task view  
- Chronicle view  
- Page stacking view   
- BackLink   
- Block Reference  
- PubLink  
- HashTag  
- Progressive Web App (PWA)  
- Full-text search 
- Local File System Access 
- Import or Export at any time  
- Your works stored in one single json file 


## Live Demo

Here we go: [Live demo](https://mdsilo.com)


## Credits

mdSilo is and will be inspired by many note-taking tools.

**Thanks to Richard for [his work on Notabase](https://github.com/churichard/notabase)**.
The project is forked from Notabase and has something changed.


## Self-Hosting

You can self-host mdSilo, though it is currently not focused on self-hosting. 

- The easy way is to deploy it on [Vercel](https://vercel.com), here is the [Vercel docs](https://vercel.com/docs); 
- The environment variables needed for deployment can be found [here](https://github.com/danloh/mdSilo-web/blob/main/.env.local.example); 
- [Supabase](https://supabase.io) as backend. Please follow the instructions in [Supabase docs](https://supabase.io/docs/guides/self-hosting); 
- The schema for database is [here](https://github.com/danloh/mdSilo-web/blob/main/schema/schema.sql).
- Sentry to mornitor error;

(Vercel and Supabase can be free-to-use for Personal Account)

Running locally
- Rename the `.env.local.example` to `.env.local`, and fill in the environment variables;
- Install the packages using `npm install`;
- Run it using `npm run dev`;
