
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";

interface PaymentSummaryProps {
  amount: number;
  onComplete: () => void;
  onCancel: () => void;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ amount, onComplete, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onComplete();
    setProcessing(false);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Payment Summary</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Room Fee:</span>
          <span>${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tax:</span>
          <span>${(amount * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium pt-2 border-t">
          <span>Total:</span>
          <span>${(amount * 1.1).toFixed(2)}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            disabled={processing}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Credit/Debit Card</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="cash">Cash (Pay at Reception)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {paymentMethod === "card" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                  disabled={processing}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" disabled={processing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" disabled={processing} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input id="nameOnCard" placeholder="John Doe" disabled={processing} />
            </div>
          </>
        )}
        
        {paymentMethod === "paypal" && (
          <div className="text-center py-4">
            <p className="mb-4">You will be redirected to PayPal to complete this payment.</p>
            <img src="/placeholder.svg" alt="PayPal" className="h-10 mx-auto" />
          </div>
        )}
        
        {paymentMethod === "cash" && (
          <div className="text-center py-4">
            <p>Please pay at the reception desk during check-in.</p>
            <p className="text-sm text-gray-500 mt-2">Your booking will be marked as "Pay at Reception"</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={processing}>
            Cancel
          </Button>
          <Button type="submit" disabled={processing}>
            {processing ? "Processing..." : "Complete Payment"}
          </Button>
        </div>
      </form>
    </div>
  );
};
