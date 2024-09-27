import {
  ArrowBigLeft,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Copy,
  CreditCard,
  Crosshair,
  Database,
  File,
  Hammer,
  Home,
  House,
  LayoutGrid,
  LineChart,
  ListFilter,
  MoreVertical,
  MoveDown,
  MoveLeft,
  MoveRight,
  Package,
  Package2,
  PanelLeft,
  RefreshCcw,
  ScrollText,
  Settings,
  ShoppingCart,
  Smartphone,
  Truck,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { ActionDialog } from "@/page_components/ActionDialog"


export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information."

export default function Dashboard() {
  const [openActionDialog, setOpenActionDialog] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <ActionDialog open={openActionDialog} setOpen={setOpenActionDialog}/>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <a
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <Smartphone className="h-5 w-5" />
            <span className="sr-only">Devices</span>
          </a>
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <Crosshair className="h-5 w-5" />
            <span className="sr-only">Inspector</span>
          </a>
          <a
            href="/builders"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <Hammer className="h-5 w-5" />
            <span className="sr-only">Builder</span>
          </a>
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <Database className="h-5 w-5" />
            <span className="sr-only">Database</span>
          </a>
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <ScrollText className="h-5 w-5" />
            <span className="sr-only">Logs</span>
          </a>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </a>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <a
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </a>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <div>Builder</div>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="min-w-[400px] max-w-[500px]">
            <Card
              className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="bg-muted/50">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Screencap
                </CardTitle>
                <div className="flex justify-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-2">
                    <RefreshCcw className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Refresh
                    </span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
              </CardContent>
              <CardFooter className="flex flex-col justify-center border-t bg-muted/50 px-6 py-3">
                <div>
                <div className="flex justify-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-2">
                    <ArrowBigLeft className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Back
                    </span>
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <House className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Home
                    </span>
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Menu
                    </span>
                  </Button>
                </div>
                </div>
                <div className="text-xs text-muted-foreground justify-self-end mt-3">
                  Updated <time dateTime="2023-11-23">November 23, 2023</time>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="w-full items-start gap-4">
              <Card 
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
              >
                <CardHeader className="pb-3">
                  <CardTitle>Flow</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Build your flow here
                  </CardDescription>
                  <Separator className="my-2" />
                </CardHeader>
                <CardContent className="flex flex-col items-center p-6 text-sm gap-2 flex-wrap">
                  <div className="group flex justify-center items-center text-sm gap-2 flex-wrap">
                    <Button className="w-32 hidden group-hover:block">Failed</Button>
                    <MoveLeft className="hidden group-hover:block" />
                    <Button className="w-32" onClick={() => setOpenActionDialog(true)}>On Step</Button>
                    <MoveRight className="hidden group-hover:block"/>
                    <Button className="w-32 hidden group-hover:block">Success</Button>
                  </div>
                  <div className="flex justify-center items-center text-sm gap-2 flex-wrap">
                    <MoveDown/>
                  </div>
                  <div className="group flex justify-center items-center text-sm gap-2 flex-wrap">
                    <Button className="w-32 hidden group-hover:block">Failed</Button>
                    <MoveLeft className="hidden group-hover:block" />
                    <Button className="w-32">Step</Button>
                    <MoveRight className="hidden group-hover:block"/>
                    <Button className="w-32 hidden group-hover:block">Success</Button>
                  </div>
                  <div className="flex justify-center items-center text-sm gap-2 flex-wrap">
                    <MoveDown/>
                  </div>
                  <div className="group flex justify-center items-center text-sm gap-2 flex-wrap">
                    <Button className="w-32 hidden group-hover:block">Failed</Button>
                    <MoveLeft className="hidden group-hover:block" />
                    <Button className="w-32"><CirclePlus className="w-4 h-4" /></Button>
                    <MoveRight className="hidden group-hover:block"/>
                    <Button className="w-32 hidden group-hover:block">Success</Button>
                  </div>
                </CardContent>
                <CardFooter>
                </CardFooter>
              </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
