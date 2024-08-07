//create a form that receive event ticket type of user choose
// receive event id from parent component
// call hook to fetch event ticket type
// use event id from props

"use client";

import { useEffect, useState } from "react";
import CounterTicket from "./CounterTicket";
import { Check, ChevronDown } from "lucide-react";
import useTransaction from "@/hooks/useTransaction";
import { useParams } from "next/navigation";
import { Event, TicketType } from "@/types/events";
import { EventTicketItem } from "@/types/eventTicket";
import { formatToIDR } from "@/utils/formatToIDR";
import { Voucher } from "@/types/voucher";
import useProfileDetails from "@/hooks/useProfileDetails";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import ModalBuyTicket from "./ModalBuyTicket";
import useEventDetails from "@/hooks/useEventDetails";
import { TransactionData, TransactionFreeData } from "@/types/transactionData";

// Define a type for the quantities object
type QuantitiesType = {
  [key: string]: number;
};

// Define a type for the item in the final array
export type TransactionItem = {
  eventId: number;
  eventTicketId: number;
  quantity: number;
};

const createTransactionItems = (
  quantities: QuantitiesType,
  eventId: string
): TransactionItem[] => {
  return Object.entries(quantities)
    .filter((entry): entry is [string, number] => entry[1] > 0)
    .map(
      ([eventTicketId, quantity]): TransactionItem => ({
        eventId: Number(eventId),
        eventTicketId: Number(eventTicketId),
        quantity,
      })
    );
};

const FormBuyTicket = () => {
  const { eventId } = useParams<{ eventId: string }>() || {};
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [buyTicketData, setBuyTicketData] = useState<TransactionData | null>(
    null
  );
  const [buyFreeTicketData, setBuyFreeTicketData] =
    useState<TransactionFreeData | null>(null);
  const [ticketCount, setTicketCount] = useState<{ [key: string]: number }>({});
  const [isTicketDropdown, setIsTicketDropdown] = useState<boolean>(false);
  const [isCheckBox, setIsCheckBox] = useState<boolean>(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const { eventTicket, isLoading, error, voucher } = useTransaction(
    eventId as string
  );
  const { data: profile } = useProfileDetails();
  const { data: eventDetails } = useEventDetails(eventId as string);

  const formattedPoints = new Intl.NumberFormat("de-DE").format(
    profile?.points || 0
  );

  useEffect(() => {
    console.log("EVENT TICKET >>>> ", eventTicket);
    console.log("VOUCHER >>>", voucher);

    if (eventTicket) {
      const initialCounts = eventTicket.reduce((acc, ticket) => {
        acc[ticket.ticketType] = 0;
        return acc;
      }, {} as { [key: string]: number });
      setTicketCount(initialCounts);
    }
  }, [eventTicket]);

  const handleCheckBox = () => {
    setIsCheckBox(!isCheckBox);
  };

  const handeDropdown = () => {
    setIsTicketDropdown(!isTicketDropdown);
  };

  const handleIncrement = (ticketId: number) => {
    formik.setFieldValue(
      `quantities.${ticketId}`,
      (formik.values.quantities[ticketId] || 0) + 1
    );
  };

  const handleDecrement = (ticketId: number) => {
    if (formik.values.quantities[ticketId] > 0) {
      formik.setFieldValue(
        `quantities.${ticketId}`,
        formik.values.quantities[ticketId] - 1
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      usePoints: false,
      quantities: {} as QuantitiesType,
      selectedVoucherId: null as unknown as number | null,
    },
    onSubmit: (values) => {
      if (isFreeEvent) {
        const freeEventData: TransactionFreeData = {
          userId: Number(userId),
          eventId: Number(eventId),
          eventTicketId: eventTicket[0].id,
        };
        setBuyFreeTicketData(freeEventData);
      }
      const items = createTransactionItems(
        values.quantities,
        eventId as string
      );

      const transactionData: TransactionData = {
        userId: Number(userId),
        eventId: Number(eventId),
        voucherId: values.selectedVoucherId,
        items,
        usePoints: values.usePoints,
      };

      setBuyTicketData(transactionData);

      console.log("Transaction data:", transactionData);
    },
  });

  const handleSelectedVoucher = (voucher: Voucher) => {
    formik.setFieldValue("selectedVoucherId", voucher.id);
    setIsTicketDropdown(false);
  };

  const handleModalOpen = () => {
    const modal = document.getElementById(
      "buy-ticket"
    ) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
  };

  if (isLoading) {
    <div className="">Loading</div>;
  }

  if (error) {
    <div className="">Error</div>;
  }

  const isFreeEvent =
    eventTicket && eventTicket.every((ticket) => ticket.price === 0);

  console.log("IS FREE EVENT>>>>>", isFreeEvent);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col rounded-lg border-2 border-primary">
          <div className="py-4 flex justify-center rounded-t-lg bg-primary text-white">
            <p className="font-medium">Choose your ticket</p>
          </div>
          <div className="flex flex-col gap-4 p-8 divide-dashed">
            <div className="flex flex-col gap-12 py-8 px-0">
              {eventTicket &&
                eventTicket.map((ticket: EventTicketItem, index: number) => (
                  <div key={index} className="flex justify-between">
                    <p className="font-bold">{ticket.ticketType}</p>
                    {!isFreeEvent ? (
                      <div className="flex gap-6">
                        <p>{formatToIDR(ticket.price)}</p>
                        <div className="flex gap-4">
                          <CounterTicket
                            value={formik.values.quantities[ticket.id] || 0}
                            onDecrement={() => handleDecrement(ticket.id)}
                            onIncrement={() => handleIncrement(ticket.id)}
                            min={0}
                            max={ticket.availableSeats}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-6">
                        <p>FREE</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            {!isFreeEvent ? (
              <div className="flex flex-col gap-4 relative">
                <div
                  onClick={handeDropdown}
                  className="flex justify-between w-full p-4 border-2 border-slate-200 rounded-lg">
                  <p>Select your voucher</p>
                  <ChevronDown color="blue" />
                </div>
                {voucher && isTicketDropdown && (
                  <div className="absolute top-16 w-full rounded-lg bg-slate-300">
                    {voucher.map((v: Voucher, index) => (
                      <div
                        key={index}
                        className="p-2 border-b border-gray-200"
                        onClick={() => handleSelectedVoucher(v)}>
                        <p>{v.name}</p>
                        <p>{v.discountPercentage}% discount</p>
                      </div>
                    ))}
                  </div>
                )}
                {formik.values.selectedVoucherId && voucher && (
                  <div className="mt-2 p-2 border border-gray-300 rounded-lg">
                    <p>Selected Voucher:</p>
                    {(() => {
                      const selectedVoucher = voucher.find(
                        (v) => v.id === formik.values.selectedVoucherId
                      );
                      if (selectedVoucher) {
                        return (
                          <>
                            <p>{selectedVoucher.name}</p>
                            <p>
                              {selectedVoucher.discountPercentage}% discount
                            </p>
                            <p>
                              Expires on:{" "}
                              {new Date(
                                selectedVoucher.expiryDate
                              ).toLocaleDateString()}
                            </p>
                          </>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  <p className="font-medium">
                    Your points: <strong>{formattedPoints}</strong>
                  </p>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="border-2 border-grey-opacity rounded-lg w-6 h-6"
                      onClick={() => {
                        formik.setFieldValue(
                          "usePoints",
                          !formik.values.usePoints
                        );
                        setIsCheckBox(!isCheckBox);
                      }}>
                      {isCheckBox && <Check color="blue" />}
                    </button>
                    <p>Use your points</p>
                  </div>
                </div>
                <button
                  onClick={handleModalOpen}
                  type="submit"
                  className="btn btn-primary w-full">
                  Buy Ticket
                </button>
              </div>
            ) : (
              <button
                onClick={handleModalOpen}
                type="submit"
                className="btn btn-primary w-full">
                Get Free Ticket
              </button>
            )}
          </div>
        </div>
      </form>
      {buyTicketData ? (
        <ModalBuyTicket
          voucher={voucher?.find((v) => v.id === buyTicketData.voucherId)}
          finalCheckoutData={!isFreeEvent ? buyTicketData : null}
          finalFreeCheckoutData={isFreeEvent ? buyFreeTicketData : null}
          idModal="buy-ticket"
          eventTicket={eventTicket as EventTicketItem[]}
          userPoints={profile?.points || 0}
          isFreeEvent={isFreeEvent || null}
          {...(eventDetails as Event)}
        />
      ) : null}
    </>
  );
};

export default FormBuyTicket;
