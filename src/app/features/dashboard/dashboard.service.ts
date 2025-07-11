import { Injectable, signal, computed } from "@angular/core";

import { CandidateStore } from "@core/models/candidate.model";
import { ChartData } from "@core/charts/types";

@Injectable()
export class DashboardService {
  // Signal for candidates data
  private candidates = signal<CandidateStore[]>(this.getMockCandidates());

  // Public readonly signal
  readonly data = this.candidates.asReadonly();

  // Computed signals for derived data
  readonly totalCandidates = computed(() => this.data().length);

  private getMockCandidates(): CandidateStore[] {
    return [
      {
        id: "1",
        fullName: "Sarah Cohen",
        email: "sarah.cohen@email.com",
        phone: "+972-50-0000001",
        age: 28,
        city: "Tel Aviv",
        hobbies: "Astronomy, Rock Climbing, Photography",
        motivation:
          "Aerospace engineer with 5 years experience in satellite technology",
        profileImage: "https://i.pravatar.cc/150?img=1",
        geo: { latitude: 32.0853, longitude: 34.7818 },
        registeredAt: new Date("2024-01-15"),
        expiresAt: new Date("2024-07-15"),
      },
      {
        id: "2",
        fullName: "David Levi",
        email: "david.levi@email.com",
        phone: "+972-50-0000002",
        age: 32,
        city: "Jerusalem",
        hobbies: "Physics, Marathon Running, Chess",
        motivation: "Physicist specializing in zero-gravity research",
        profileImage: "https://i.pravatar.cc/150?img=2",
        geo: { latitude: 31.7683, longitude: 35.2137 },
        registeredAt: new Date("2024-01-12"),
        expiresAt: new Date("2024-07-12"),
      },
      {
        id: "3",
        fullName: "Maya Goldberg",
        email: "maya.goldberg@email.com",
        phone: "+972-50-0000003",
        age: 26,
        city: "Haifa",
        hobbies: "Piloting, Scuba Diving, Robotics",
        motivation: "Commercial pilot with advanced flight training",
        profileImage: "https://i.pravatar.cc/150?img=3",
        geo: { latitude: 32.794, longitude: 34.9896 },
        registeredAt: new Date("2024-01-18"),
        expiresAt: new Date("2024-07-18"),
      },
      {
        id: "4",
        fullName: "Amit Rosenberg",
        email: "amit.rosenberg@email.com",
        phone: "+972-50-0000004",
        age: 35,
        city: "Beer Sheva",
        hobbies: "Engineering, Mountain Biking, Cooking",
        motivation: "Mechanical engineer with space systems expertise",
        profileImage: "https://i.pravatar.cc/150?img=4",
        geo: { latitude: 31.2518, longitude: 34.7913 },
        registeredAt: new Date("2024-01-20"),
        expiresAt: new Date("2024-07-20"),
      },
      {
        id: "5",
        fullName: "Noa Shapira",
        email: "noa.shapira@email.com",
        phone: "+972-50-0000005",
        age: 29,
        city: "Eilat",
        hobbies: "Marine Biology, Yoga, Photography",
        motivation: "Biologist researching life in extreme environments",
        profileImage: "https://i.pravatar.cc/150?img=5",
        geo: { latitude: 29.5581, longitude: 34.9482 },
        registeredAt: new Date("2024-01-14"),
        expiresAt: new Date("2024-07-14"),
      },
      {
        id: "6",
        fullName: "Yosef Katz",
        email: "yosef.katz@email.com",
        phone: "+972-50-0000006",
        age: 31,
        city: "Netanya",
        hobbies: "Software Development, Gaming, Music",
        motivation:
          "Software engineer specializing in mission-critical systems",
        profileImage: "https://i.pravatar.cc/150?img=6",
        geo: { latitude: 32.3215, longitude: 34.8532 },
        registeredAt: new Date("2024-01-10"),
        expiresAt: new Date("2024-07-10"),
      },
    ];
  }

  // Static data methods (could also be signals if they change)
  getAgeData(): ChartData[] {
    return [
      { name: "20-25", value: 8 },
      { name: "26-30", value: 15 },
      { name: "31-35", value: 12 },
      { name: "36-40", value: 7 },
      { name: "41+", value: 3 },
    ];
  }

  // getLocationData(): LocationData[] {
  //   return [
  //     { city: "Tel Aviv", count: 12, lat: 32.0853, lng: 34.7818 },
  //     { city: "Jerusalem", count: 8, lat: 31.7683, lng: 35.2137 },
  //     { city: "Haifa", count: 6, lat: 32.794, lng: 34.9896 },
  //     { city: "Beer Sheva", count: 4, lat: 31.2518, lng: 34.7915 },
  //     { city: "Eilat", count: 3, lat: 29.5581, lng: 34.9482 },
  //   ];
  // }

  // getVisitsData(): VisitData[] {
  //   return [
  //     { date: "Jan 1", visits: 120, registrations: 15 },
  //     { date: "Jan 2", visits: 150, registrations: 22 },
  //     { date: "Jan 3", visits: 180, registrations: 28 },
  //     { date: "Jan 4", visits: 200, registrations: 35 },
  //     { date: "Jan 5", visits: 250, registrations: 45 },
  //     { date: "Jan 6", visits: 300, registrations: 52 },
  //     { date: "Jan 7", visits: 280, registrations: 48 },
  //   ];
  // }

  // getHobbiesData(): ChartData[] {
  //   return [
  //     { name: "Astronomy", value: 15 },
  //     { name: "Sports", value: 12 },
  //     { name: "Technology", value: 18 },
  //     { name: "Arts", value: 8 },
  //     { name: "Science", value: 22 },
  //     { name: "Adventure", value: 10 },
  //   ];
  // }
}
