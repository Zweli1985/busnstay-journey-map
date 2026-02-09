import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  Gift,
  LogOut,
  Settings,
  Clock,
  TrendingUp,
} from 'lucide-react';
import DigitalWallet from '@/components/DigitalWallet';
import LoyaltyProgram from '@/components/LoyaltyProgram';
import { useToast } from '@/hooks/use-toast';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: Date;
  totalTrips: number;
  memberSince: string;
}

const AccountDashboard = () => {
  const { profile, user, signOut } = useAuthContext();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [walletBalance, setWalletBalance] = useState(2850.5);
  const [loyaltyPoints, setLoyaltyPoints] = useState(2450);
  const [currentTier, setCurrentTier] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('silver');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddFunds = async (amount: number, method: string) => {
    // TODO: Integrate with payment processor
    toast({
      title: 'Fund Added',
      description: `$${amount} added via ${method}. (Demo mode)`,
    });
    console.log('Add funds:', { amount, method });
  };

  const handleTransfer = async (recipient: string, amount: number) => {
    // TODO: Implement transfer logic
    toast({
      title: 'Transfer Initiated',
      description: `$${amount} transfer pending. (Demo mode)`,
    });
    console.log('Transfer:', { recipient, amount });
  };

  const handleWithdraw = async (amount: number, method: string) => {
    // TODO: Implement withdrawal logic
    toast({
      title: 'Withdrawal Initiated',
      description: `$${amount} withdrawal to ${method} pending. (Demo mode)`,
    });
    console.log('Withdraw:', { amount, method });
  };

  const handleRedeemReward = (rewardId: string) => {
    // TODO: Integrate with Supabase
    toast({
      title: 'Reward Redeemed!',
      description: 'Your reward is being processed.',
    });
    console.log('Reward redeemed:', rewardId);
  };

  const handleReferFriend = () => {
    const referralLink = `https://busnstay.com/ref/${user?.id || 'user'}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Referral Link Copied',
      description: 'Share this link with your friends to earn 500 bonus points!',
    });
  };

  if (!profile || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="text-center">
          <p className="text-white">Loading account...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white p-4 md:p-8">
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-2">
              My Account
            </motion.h1>
            <motion.p variants={itemVariants} className="text-slate-400">
              Welcome back, {profile.full_name || user.email}
            </motion.p>
          </div>
          <div className="flex gap-4">
            <NotificationCenter />
            <motion.button
              variants={itemVariants}
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-lg hover:bg-slate-800 transition"
            >
              <Settings className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-950/20 border-blue-700/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Wallet Balance</p>
                  <p className="text-2xl font-bold mt-2">${walletBalance.toFixed(2)}</p>
                </div>
                <Wallet className="w-10 h-10 text-blue-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-950/20 border-purple-700/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Loyalty Points</p>
                  <p className="text-2xl font-bold mt-2">{loyaltyPoints.toLocaleString()}</p>
                </div>
                <Gift className="w-10 h-10 text-purple-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 border-amber-700/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Current Tier</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="capitalize bg-amber-600 hover:bg-amber-700">
                      {currentTier}
                    </Badge>
                  </div>
                </div>
                <TrendingUp className="w-10 h-10 text-amber-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-green-950/20 border-green-700/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Member Since</p>
                  <p className="text-2xl font-bold mt-2">245 days</p>
                </div>
                <Clock className="w-10 h-10 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700/50 p-1 mb-6">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-600 transition"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="wallet"
                className="data-[state=active]:bg-blue-600 transition"
              >
                Wallet
              </TabsTrigger>
              <TabsTrigger
                value="rewards"
                className="data-[state=active]:bg-blue-600 transition"
              >
                Rewards
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-blue-600 transition"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Mini Wallet Card */}
                <Card className="bg-slate-800/30 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Quick Wallet Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                      <p className="text-sm opacity-80">Available Balance</p>
                      <p className="text-3xl font-bold mt-2">${walletBalance.toFixed(2)}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-10"
                        onClick={() => setActiveTab('wallet')}
                      >
                        Add Funds
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-10"
                        onClick={() => setActiveTab('wallet')}
                      >
                        Transfer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-10"
                        onClick={() => setActiveTab('wallet')}
                      >
                        Withdraw
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Mini Loyalty Card */}
                <Card className="bg-slate-800/30 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Loyalty Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Points to Next Tier</span>
                        <span className="font-bold text-amber-400">550 / 2000</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full"
                          style={{ width: '27.5%' }}
                        ></div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
                      size="sm"
                      onClick={() => setActiveTab('rewards')}
                    >
                      View Rewards
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Account Info */}
              <motion.div variants={itemVariants}>
                <Card className="bg-slate-800/30 border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Full Name</p>
                          <p className="font-semibold">{profile.full_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Email</p>
                          <p className="font-semibold">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Phone</p>
                          <p className="font-semibold">{profile.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Total Trips</p>
                          <p className="font-semibold">24</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="wallet">
              <DigitalWallet
                balance={walletBalance}
                currency="USD"
                onAddFunds={handleAddFunds}
                onTransfer={handleTransfer}
                onWithdraw={handleWithdraw}
              />
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards">
              <LoyaltyProgram
                currentPoints={loyaltyPoints}
                currentTier={currentTier}
                onRedeemReward={handleRedeemReward}
                onReferFriend={handleReferFriend}
              />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <motion.div variants={itemVariants}>
                <Card className="bg-slate-800/30 border-slate-700/50">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Email Preferences</h4>
                        <div className="space-y-2 text-sm text-slate-400">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                            <span>Booking confirmations</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                            <span>Loyalty rewards updates</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                            <span>Special offers and promotions</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4" />
                            <span>Weekly newsletter</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-700/50" />

                    <div className="space-y-4">
                      <h4 className="font-semibold">Security</h4>
                      <Button variant="outline" className="w-full justify-start">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Two-Factor Authentication
                      </Button>
                    </div>

                    <hr className="border-slate-700/50" />

                    <div className="space-y-4">
                      <h4 className="font-semibold">Account Actions</h4>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccountDashboard;
