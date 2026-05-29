import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ChevronRight, Crown, Loader2, Moon, Palette, Settings, Sun, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import { api } from "../../convex/_generated/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function SettingsPage() {
  const user = useQuery(api.auth.currentUser);
  const { theme, toggleTheme, switchable } = useTheme();
  const { signIn, signOut } = useAuthActions();
  const deleteAccount = useMutation(api.users.deleteAccount);
  const navigate = useNavigate();

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStep, setPasswordStep] = useState<"request" | "verify">("request");

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.append("email", user?.email || "");
    formData.append("flow", "reset");
    try {
      await signIn("password", formData);
      setPasswordStep("verify");
    } catch {
      setError("Could not send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("email", user?.email || "");
    formData.append("flow", "reset-verification");
    try {
      await signIn("password", formData);
      setSuccess("Password changed successfully!");
      setTimeout(() => {
        setChangePasswordOpen(false);
        setPasswordStep("request");
        setSuccess("");
      }, 1500);
    } catch {
      setError("Invalid code or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteAccount();
      await signOut();
      navigate("/");
    } catch {
      setError("Could not delete account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div className="space-y-8 max-w-2xl mx-auto" initial="hidden" animate="visible">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 royal-heading">
          <Settings className="size-6 text-royal-gold" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm font-sans">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile card with gradient banner */}
      <motion.div custom={1} variants={fadeUp}>
        <Card className="overflow-hidden border-royal-gold/10">
          <div className="h-20 bg-gradient-to-r from-royal-navy via-royal-navy-light to-royal-navy relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(160,128,48,0.15)_0%,transparent_60%)]" />
            <div className="absolute top-3 right-4 opacity-[0.06]">
              <Crown className="size-14 text-royal-gold" />
            </div>
          </div>
          <CardContent className="-mt-10 pb-6">
            <div className="flex items-end gap-4">
              <Avatar className="size-16 border-4 border-background shadow-lg">
                <AvatarFallback className="text-xl bg-royal-gold text-royal-navy font-bold font-serif">
                  {user?.name?.charAt(0).toUpperCase() || <User className="size-6" />}
                </AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <p className="font-semibold font-sans">{user?.name || "User"}</p>
                <p className="text-sm text-muted-foreground font-sans">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div custom={2} variants={fadeUp}>
        <Card className="border-royal-gold/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-sans">
              <Palette className="size-4 text-royal-gold" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {switchable ? (
              <div className="flex items-center justify-between rounded-lg border border-royal-gold/10 p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-gradient-to-br from-royal-gold/15 to-royal-gold/5 flex items-center justify-center">
                    {theme === "light" ? (
                      <Moon className="size-5 text-royal-navy" />
                    ) : (
                      <Sun className="size-5 text-royal-gold" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dark-mode" className="font-medium font-sans text-sm">
                      Dark mode
                    </Label>
                    <p className="text-xs text-muted-foreground font-sans">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground px-4 py-2 font-sans">
                Theme follows your system preference
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account */}
      <motion.div custom={3} variants={fadeUp}>
        <Card className="border-royal-gold/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-sans">
              <User className="size-4 text-royal-gold" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              type="button"
              onClick={() => setChangePasswordOpen(true)}
              className="w-full flex items-center justify-between rounded-lg border border-royal-gold/10 p-4 transition-colors hover:bg-muted/50 text-left"
            >
              <div>
                <p className="font-medium text-sm font-sans">Change password</p>
                <p className="text-xs text-muted-foreground font-sans">
                  Update your account password
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteAccountOpen(true)}
              className="w-full flex items-center justify-between rounded-lg border border-destructive/20 p-4 transition-colors hover:bg-destructive/5 text-left"
            >
              <div>
                <p className="font-medium text-sm text-destructive font-sans">Delete account</p>
                <p className="text-xs text-muted-foreground font-sans">
                  Permanently delete your account and data
                </p>
              </div>
              <ChevronRight className="size-4 text-destructive" />
            </button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change password dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="royal-heading">Change Password</DialogTitle>
            <DialogDescription className="font-sans">
              {passwordStep === "request"
                ? "We'll send a verification code to your email."
                : "Enter the code from your email and your new password."}
            </DialogDescription>
          </DialogHeader>
          {passwordStep === "request" ? (
            <form onSubmit={handleRequestPasswordReset}>
              <div className="py-4">
                <p className="text-sm text-muted-foreground font-sans">
                  A reset code will be sent to:{" "}
                  <span className="font-medium text-foreground">{user?.email}</span>
                </p>
              </div>
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 mb-4 font-sans">{error}</p>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setChangePasswordOpen(false)} className="font-sans">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream font-sans">
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  Send Code
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans text-xs">Verification Code</Label>
                <Input name="code" type="text" placeholder="Enter code from email" autoComplete="one-time-code" required className="border-royal-gold/20 font-sans" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-xs">New Password</Label>
                <Input name="newPassword" type="password" placeholder="••••••••" minLength={6} autoComplete="new-password" required className="border-royal-gold/20 font-sans" />
              </div>
              {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 font-sans">{error}</p>}
              {success && <p className="text-sm text-success bg-success/10 rounded-lg px-3 py-2 font-sans">{success}</p>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setPasswordStep("request"); setError(""); }} className="font-sans">Back</Button>
                <Button type="submit" disabled={loading} className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream font-sans">
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  Change Password
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete account dialog */}
      <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="royal-heading">Delete Account</DialogTitle>
            <DialogDescription className="font-sans">
              This action cannot be undone. This will permanently delete your account and remove all your data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground font-sans">
              Are you sure you want to delete your account?
            </p>
          </div>
          {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 font-sans">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAccountOpen(false)} className="font-sans">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading} className="font-sans">
              {loading && <Loader2 className="size-4 animate-spin" />}
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
