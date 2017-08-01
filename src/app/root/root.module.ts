import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Router, Route } from "@angular/router";
import { HttpModule } from "@angular/http";
import { RootComponent } from "./root.component";
import { SplashScreenComponent } from "./splash-screen/splash-screen.component";

const InitialRoutes: Route[] = [
    { path: "", redirectTo: "splashscreen", pathMatch: "full" },
    { path: "splashscreen", component: SplashScreenComponent }
];

@NgModule({
    imports: [
        RouterModule,
        HttpModule,
        BrowserModule,
        RouterModule.forRoot(InitialRoutes)
    ],
    declarations: [RootComponent, SplashScreenComponent],
    bootstrap: [RootComponent],
})
export class RootModule {
    public constructor() {

        console.log("stuff happening")
    }
}
