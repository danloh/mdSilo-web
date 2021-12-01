import { useMemo } from 'react';
import { Feature, PRICING_PLANS } from 'constants/pricing';
import { useStore, store } from 'lib/store';

export default function useFeature(feature: Feature) {
  const billingDetails = useStore((state) => state.billingDetails);

  // Whether or not the particular user can actually use the feature
  const isEnabled = useMemo(() => {
    const planId = billingDetails.planId;
    if (planId == 'Preparing') {
      return false;
    }
    const planFeature = PRICING_PLANS[planId].features.find(
      (f) => f.name === feature
    );

    if (!planFeature) {
      return false;
    }

    switch (feature) {
      case Feature.NumOfNotes:
        return true; // calcNotesNum() < (planFeature.amount || 0);
      default:
        return false;
    }
  }, [feature, billingDetails]);

  return isEnabled;
}

// export to where need calc
export function calcNotesNum() {
  const notes = store.getState().notes;
  const noteList = Object.values(notes);
  const myNotes = noteList.filter(n => !n.is_wiki);
  const numOfNotes = myNotes.length;
  return numOfNotes;
}
