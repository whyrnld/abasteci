import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PixSection } from "@/components/settings/PixSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";

const Settings = () => {
  const [preferredFuel, setPreferredFuel] = useState("regular");
  const [searchRadius, setSearchRadius] = useState(10);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [receiptAlerts, setReceiptAlerts] = useState(true);
  const [defaultPixKey, setDefaultPixKey] = useState("");
  const [defaultPixKeyType, setDefaultPixKeyType] = useState("cpf");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile } = useProfile();

  useEffect(() => {
    if (profile) {
      setPreferredFuel(profile.preferred_fuel_type || "regular");
      setSearchRadius(profile.search_radius || 10);
      setDefaultPixKey(profile.pix_key || "");
      setDefaultPixKeyType(profile.pix_key_type || "cpf");
    }
  }, [profile]);

  const handleSavePreferences = async () => {
    try {
      await updateProfile.mutateAsync({
        preferred_fuel_type: preferredFuel,
        search_radius: searchRadius,
        pix_key: defaultPixKey,
        pix_key_type: defaultPixKeyType,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar as preferências.",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 px-6 py-6 pb-24">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium">Ajustes</h1>
      </section>

      <div className="space-y-4">
        <ProfileSection />
        
        <PixSection
          defaultPixKey={defaultPixKey}
          defaultPixKeyType={defaultPixKeyType}
          setDefaultPixKey={setDefaultPixKey}
          setDefaultPixKeyType={setDefaultPixKeyType}
          handleSavePreferences={handleSavePreferences}
        />

        <PreferencesSection
          preferredFuel={preferredFuel}
          searchRadius={searchRadius}
          setPreferredFuel={setPreferredFuel}
          setSearchRadius={setSearchRadius}
          handleSavePreferences={handleSavePreferences}
        />

        <NotificationsSection
          priceAlerts={priceAlerts}
          receiptAlerts={receiptAlerts}
          setPriceAlerts={setPriceAlerts}
          setReceiptAlerts={setReceiptAlerts}
        />

        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Settings;