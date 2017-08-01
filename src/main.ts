import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { RootModule } from "./app/root/root.module";

platformBrowserDynamic().bootstrapModule(RootModule)
    .then(success => console.log(`Bootstrap success`))
    .catch(err => console.error(err));
