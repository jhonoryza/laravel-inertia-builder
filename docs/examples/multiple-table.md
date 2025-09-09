# Multiple Table

you can create multiple table in one page

for example in a view page lets say you want to show 2 tables with pagination, filter, action, search etc.

lets create a new variable `rewardDistribution` and `leaderboard` to be returned to the view

you also need to create a new custom view called `game_period/show`

```php
<?php
public function show(GamePeriod $gamePeriod): Response
{
    $rewardDistribution = GamePeriodTable::getRewardDistribution($gamePeriod);
    $leaderboard = GamePeriodTable::getLeaderboard($gamePeriod);

    return Inertia::render('game_period/show', [
        'rewardDistribution' => $rewardDistribution,
        'leaderboard' => $leaderboard,
        'form' => GamePeriodForm::view($gamePeriod),
    ]);
}
```

in `GamePeriodTable` class add this function

you need to set :

1. `dataName` : match according data name return from controller, this is for partial reload when state change.
2. `prefix` : can be anything / random, but unique, this is required to isolate table state from other table.

```php
<?php
public static function getLeaderboard(GamePeriod $gamePeriod)
{
    return Table::make(LeaderboardWithReward::class)
        ->dataName('leaderboard')
        ->prefix('lwr')
        ->tableRoute(route('game_periods.show', $gamePeriod))
```

```php
<?php
public static function getRewardDistribution(GamePeriod $gamePeriod)
{
    return Table::make(LeaderboardReward::class)
        ->dataName('rewardDistribution')
        ->prefix('rd')
        ->tableRoute(route('game_periods.show', $gamePeriod))
```

`game_period/show.tsx` sample file, in this file we add 2 `AppDataTable` after `AppFormBuilder`

```tsx
type PageProps = {
    rewardDistribution: DataTableProps;
    leaderboard: DataTableProps;
    form: Form;
};

export default function Show({ rewardDistribution, leaderboard, form }: PageProps) {
    const { baseRoute, routeId, title } = form;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: title, href: route(baseRoute + ".index") },
        { title: 'show', href: route(baseRoute + ".show", routeId) },
        { title: `#${routeId}`, href: '' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`show ${title} #${routeId}`} />
            <div className="p-4">
                <Card className="p-4 max-w-full">
                    <CardContent>
                        <AppFormBuilder form={form} >
                            {{
                                formAction: (processing) => (
                                    <AppFormBuilderAction form={form} processing={processing} />
                                )
                            }}
                        </AppFormBuilder>
                    </CardContent>
                </Card>
                <div className="py-4">
                    <h1 className="font-bold b-4">Reward Distribution</h1>
                    <AppDataTable data={rewardDistribution}>
                        {{
                            rowAction: (item) => (
                                <AppDatatableRowActions
                                    item={item}
                                    baseRoute={rewardDistribution.baseRoute}
                                    edit={rewardDistribution.edit}
                                    show={rewardDistribution.view}
                                    del={rewardDistribution.delete}
                                />
                            )
                        }}
                    </AppDataTable>
                </div>
                <div className="py-4">
                    <h1 className="font-bold b-4">Leaderboard</h1>
                    <AppDataTable data={leaderboard} />
                </div>
            </div>
        </AppLayout>
    );
}
```
