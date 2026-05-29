import { useConvexAuth } from "convex/react";
import { ArrowRight, Crown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { APP_NAME } from "@/lib/constants";
import { Button } from "./ui/button";

export function Header() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header className="sticky top-0 z-50 border-b border-royal-gold/10 bg-background/80 backdrop-blur-md">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            <div className="size-9 rounded-lg bg-royal-navy flex items-center justify-center">
              <Crown className="size-4 text-royal-gold" />
            </div>
            <div className="hidden sm:block">
              <span className="text-royal-navy font-bold">{APP_NAME}</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {isLoading ? null : isAuthenticated ? (
              <Button
                size="sm"
                className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream"
                asChild
              >
                <Link to="/dashboard">
                  Open App
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              !isAuthPage && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-royal-navy hover:bg-royal-gold/10"
                    asChild
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream"
                    asChild
                  >
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
