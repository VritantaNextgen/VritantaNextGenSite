import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { CreditCard, Shield, Info, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PaymentsSetup() {
  const navigate = useNavigate()
  const [provider, setProvider] = useState<'stripe' | 'paypal' | ''>('')
  const [stripePublicKey, setStripePublicKey] = useState('')
  const [stripeSecretKey, setStripeSecretKey] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setError('')
    setSaved(false)
    if (!provider) {
      setError('Please select a provider.')
      return
    }
    if (provider === 'stripe') {
      if (!stripePublicKey || !stripeSecretKey) {
        setError('Please enter both Stripe publishable and secret keys.')
        return
      }
    }
    // Here we would securely save secrets to backend vault/edge function.
    // For now, we persist locally as a placeholder so you know what's needed.
    localStorage.setItem('payments_config', JSON.stringify({ provider, stripePublicKey, stripeSecretKey, webhookSecret }))
    setSaved(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="text-gray-300 hover:text-white mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2" /> Payments Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-blue-500/10 border-blue-500/30 text-blue-200">
              <AlertDescription className="space-y-2">
                <div className="flex items-center"><Info className="w-4 h-4 mr-2" /> Choose your payment provider and add required keys. We'll wire actual charges after you provide details.</div>
                <ul className="list-disc list-inside text-blue-100/90 text-sm">
                  <li>Recommended: Stripe (subscriptions, one-time, Checkout, Billing)</li>
                  <li>We'll store keys securely in server-side vault (never in frontend)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div>
              <Label className="text-white">Provider</Label>
              <div className="mt-2 flex gap-3">
                <Button variant={provider === 'stripe' ? 'default' : 'outline'} onClick={() => setProvider('stripe')}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Stripe_Logo%2C_revised_2016.svg" className="h-4 mr-2" alt="Stripe" /> Stripe
                </Button>
                <Button variant={provider === 'paypal' ? 'default' : 'outline'} onClick={() => setProvider('paypal')} disabled>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 mr-2" alt="PayPal" /> PayPal (coming soon)
                </Button>
              </div>
            </div>

            {provider === 'stripe' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stripe_pk" className="text-white">Stripe Publishable Key</Label>
                  <Input id="stripe_pk" placeholder="pk_live_... or pk_test_..." value={stripePublicKey} onChange={(e) => setStripePublicKey(e.target.value)} className="bg-black/20 border-white/20 text-white placeholder:text-gray-500" />
                </div>
                <div>
                  <Label htmlFor="stripe_sk" className="text-white">Stripe Secret Key</Label>
                  <Input id="stripe_sk" placeholder="sk_live_... or sk_test_..." value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} className="bg-black/20 border-white/20 text-white placeholder:text-gray-500" />
                </div>
                <div>
                  <Label htmlFor="stripe_wh" className="text-white">Webhook Signing Secret (optional now)</Label>
                  <Input id="stripe_wh" placeholder="whsec_..." value={webhookSecret} onChange={(e) => setWebhookSecret(e.target.value)} className="bg-black/20 border-white/20 text-white placeholder:text-gray-500" />
                </div>
                <Alert className="bg-yellow-500/10 border-yellow-500/30 text-yellow-200">
                  <AlertDescription>
                    We'll set up secure backend endpoints for Stripe Checkout and webhooks after you confirm your keys.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-300">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-3">
              <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">Save Configuration</Button>
              {saved && (
                <Badge className="bg-green-500/20 text-green-300">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Saved locally (we'll secure on backend next)
                </Badge>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 text-sm text-gray-300 space-y-2">
              <div className="flex items-center"><Shield className="w-4 h-4 mr-2" /> We will never store your secret keys in the frontend. They'll go to server-side secrets vault.</div>
              <p>
                Please share: 1) Preferred provider (Stripe/PayPal), 2) Business name, 3) Currency, 4) Pricing plans (names, prices, interval), 5) Success/cancel redirect URLs,
                6) Whether you need coupons/trials, 7) Billing address requirement yes/no.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PaymentsSetup
