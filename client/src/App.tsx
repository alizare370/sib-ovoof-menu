/* Design philosophy: the app shell keeps the editorial food-branding direction consistent and intentionally light. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminAssets from "./pages/AdminAssets";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return <Switch><Route path="/" component={Home} /><Route path="/admin/assets" component={AdminAssets} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
