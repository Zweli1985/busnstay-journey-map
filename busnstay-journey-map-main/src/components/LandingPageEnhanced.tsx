import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, ArrowRight, Loader2, Navigation, UtensilsCrossed, 
  Star, Zap, Clock, MapPinCheck, TrendingUp, ChefHat, Utensils, Truck 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Town } from '@/types/journey';
import { searchTowns, findRoutes, RouteDefinition } from '@/data/zambiaRoutes';
import { useAuthContext } from '@/contexts/useAuthContext';

interface LandingPageEnhancedProps {
  onRouteSelect: (route: RouteDefinition) => void;
}

const LandingPageEnhanced = ({ onRouteSelect }: LandingPageEnhancedProps) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromTown, setFromTown] = useState<Town | null>(null);
  const [toTown, setToTown] = useState<Town | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<Town[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Town[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fromQuery.length >= 2) {
      setFromSuggestions(searchTowns(fromQuery));
      setShowFromDropdown(true);
    } else {
      setFromSuggestions([]);
    }
  }, [fromQuery]);

  useEffect(() => {
    if (toQuery.length >= 2) {
      setToSuggestions(searchTowns(toQuery));
      setShowToDropdown(true);
    } else {
      setToSuggestions([]);
    }
  }, [toQuery]);

  const selectFromTown = (town: Town) => {
    setFromTown(town);
    setFromQuery(town.name);
    setShowFromDropdown(false);
  };

  const selectToTown = (town: Town) => {
    setToTown(town);
    setToQuery(town.name);
    setShowToDropdown(false);
  };

  const handleSearch = () => {
    if (!fromTown || !toTown) {
      setError('Please select both cities');
      return;
    }

    if (fromTown.id === toTown.id) {
      setError('Please select different cities');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      const routes = findRoutes(fromTown.id, toTown.id);
      setIsLoading(false);
      
      if (routes.length > 0) {
        onRouteSelect(routes[0]);
      } else {
        setError('Route not available');
      }
    }, 500);
  };

  const features = [
    {
      icon: UtensilsCrossed,
      title: 'Eat on Route',
      description: 'Order from approved restaurants at bus stations',
      color: 'from-orange-500/20 to-red-500/20',
    },
    {
      icon: Zap,
      title: 'Quick Delivery',
      description: 'K20 + distance-based pricing, always transparent',
      color: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      icon: MapPinCheck,
      title: 'Location Tracking',
      description: 'Real-time GPS tracking of your food delivery',
      color: 'from-green-500/20 to-blue-500/20',
    },
    {
      icon: TrendingUp,
      title: 'Earn for Restaurants',
      description: 'Get transaction fees while serving travelers',
      color: 'from-purple-500/20 to-pink-500/20',
    },
  ];

  const popularRoutes = [
    { from: 'Lusaka', to: 'Livingstone', distance: '382 km' },
    { from: 'Lusaka', to: 'Ndola', distance: '309 km' },
    { from: 'Ndola', to: 'Livingstone', distance: '485 km' },
    { from: 'Lusaka', to: 'Chipata', distance: '546 km' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">BusNStay</h1>
              <p className="text-xs text-muted-foreground">Food on Route</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm">Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-6">
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-1 rounded-full bg-orange-500/10 text-orange-600 text-sm font-medium mb-4"
                >
                  ✨ Hungry on Your Journey?
                </motion.span>
                <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
                  Delicious Food,{' '}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Every Journey
                  </span>
                </h1>
              </div>

              <p className="text-xl text-muted-foreground max-w-2xl">
                Order food from verified restaurants at bus stations across Zambia. Fast, affordable delivery with transparent K20+ pricing.
              </p>

              <div className="flex gap-3 pt-6">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  <UtensilsCrossed className="w-5 h-5 mr-2" />
                  Order Now
                </Button>
                <Button size="lg" variant="outline">
                  For Restaurants
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {[
                  { value: '150+', label: 'Restaurants' },
                  { value: '45', label: 'Routes' },
                  { value: '10K+', label: 'Orders' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                  >
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Illustration/Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-3xl" />
            <Card className="relative border-2 border-orange-500/20">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <ChefHat className="w-8 h-8 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">Sofia's Pizza Kitchen</p>
                      <p className="text-xs text-muted-foreground">Ready in 20 mins</p>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-br from-orange-300 to-red-300 rounded-lg flex items-center justify-center">
                    <span className="text-6xl">🍕</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Delivery Fee</p>
                      <p className="font-bold">K25</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-bold">K89</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Start Your Food Journey
          </h2>

          <Card className="border-2">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* From */}
                  <div ref={fromRef} className="relative">
                    <label className="text-sm font-medium">From</label>
                    <div className="relative mt-2">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Departure city"
                        value={fromQuery}
                        onChange={(e) => setFromQuery(e.target.value)}
                        onFocus={() => fromQuery.length >= 2 && setShowFromDropdown(true)}
                        className="pl-10"
                      />
                      <AnimatePresence>
                        {showFromDropdown && fromSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full mt-2 w-full bg-popover border rounded-lg shadow-lg z-50"
                          >
                            {fromSuggestions.map((town) => (
                              <button
                                key={town.id}
                                onClick={() => selectFromTown(town)}
                                className="w-full text-left px-4 py-2 hover:bg-muted transition text-sm"
                              >
                                {town.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* To */}
                  <div ref={toRef} className="relative">
                    <label className="text-sm font-medium">To</label>
                    <div className="relative mt-2">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Destination city"
                        value={toQuery}
                        onChange={(e) => setToQuery(e.target.value)}
                        onFocus={() => toQuery.length >= 2 && setShowToDropdown(true)}
                        className="pl-10"
                      />
                      <AnimatePresence>
                        {showToDropdown && toSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full mt-2 w-full bg-popover border rounded-lg shadow-lg z-50"
                          >
                            {toSuggestions.map((town) => (
                              <button
                                key={town.id}
                                onClick={() => selectToTown(town)}
                                className="w-full text-left px-4 py-2 hover:bg-muted transition text-sm"
                              >
                                {town.name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearch}
                      disabled={isLoading || !fromTown || !toTown}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-center mb-12">Why Choose BusNStay?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full border-0 bg-gradient-to-br from-muted/50 to-muted/30">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Routes */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Popular Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularRoutes.map((route, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  // Handle route click
                }}
                className="p-4 rounded-lg border border-border hover:border-orange-500/50 transition text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{route.distance}</p>
                    <p className="font-bold">{route.from} → {route.to}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-display font-bold">Ready to Eat Well on Route?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of travelers enjoying delicious food from verified restaurants at every stop
          </p>
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 BusNStay. Nourish Every Journey.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageEnhanced;
